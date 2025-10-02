package com.streaming.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.streaming.backend.dto.CryptoPriceDto;
import com.streaming.backend.dto.TradeDto;
import com.streaming.backend.model.CryptoPrice;
import com.streaming.backend.model.Trade;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import jakarta.websocket.*;

import java.net.URI;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@ClientEndpoint
public class CryptoProducer {

    private final KafkaTemplate<String, Trade> tradeKafkaTemplate;
    private final KafkaTemplate<String, CryptoPrice> priceKafkaTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    // Track last sent trade per symbol (for throttled stream)
    private final Map<String, Long> lastTradeSent = new ConcurrentHashMap<>();
    private static final long TRADE_THROTTLE_MS = 1000; // 1 trade/sec per symbol

    public CryptoProducer(KafkaTemplate<String, Trade> tradeKafkaTemplate,
                          KafkaTemplate<String, CryptoPrice> priceKafkaTemplate) {
        this.tradeKafkaTemplate = tradeKafkaTemplate;
        this.priceKafkaTemplate = priceKafkaTemplate;
    }

    @OnMessage
    public void onMessage(String message) {
        try {
            JsonNode root = objectMapper.readTree(message);
            JsonNode data = root.get("data");
            if (data == null) return;

            String eventType = data.get("e").asText();
            String symbol = data.get("s").asText().toLowerCase();

            if ("trade".equals(eventType)) {
                // ✅ Parse JSON into DTO
                TradeDto dto = objectMapper.treeToValue(data, TradeDto.class);
                // ✅ Convert DTO -> Entity
                Trade trade = Trade.builder()
                        .tradeId(dto.getTradeId())
                        .symbol(dto.getSymbol())
                        .price(Double.parseDouble(dto.getPrice()))
                        .quantity(Double.parseDouble(dto.getQuantity()))
                        .timestamp(dto.getTimestamp())
                        .buyerMaker(dto.isBuyerMaker())
                        .build();

                // ✅ 1) Send RAW trades (all) → ClickHouse consumer
                tradeKafkaTemplate.send("raw-trades-" + symbol, trade);

                // ✅ 2) Send throttled trades (for UI)
                long now = System.currentTimeMillis();
                if (now - lastTradeSent.getOrDefault(symbol, 0L) >= TRADE_THROTTLE_MS) {
                    tradeKafkaTemplate.send("trades-" + symbol, trade);
                    lastTradeSent.put(symbol, now);
                    System.out.println("📤 Sent throttled trade to trades-" + symbol + ": " + trade);
                }
            }

            else if ("24hrTicker".equals(eventType)) {
                // 🔹 Parse price/ticker
                CryptoPriceDto dto = objectMapper.treeToValue(data, CryptoPriceDto.class);
                // ✅ Convert DTO -> Entity
                CryptoPrice price = CryptoPrice.builder()
                        .symbol(dto.getSymbol())
                        .price(Double.parseDouble(dto.getLastPrice()))
                        .timestamp(dto.getEventTime())
                        .build();

                // ✅ Send clean entity into Kafka
                priceKafkaTemplate.send("prices-" + symbol, price);
                System.out.println("📤 Sent price to prices-" + symbol + ": " + dto);
            }

        } catch (Exception e) {
            System.err.println("❌ Error processing Binance event: " + e.getMessage());
        }
    }

    @PostConstruct
    public void start() {
        try {
            WebSocketContainer container = ContainerProvider.getWebSocketContainer();
            // Subscribing to both trades + tickers
            String uri = "wss://stream.binance.com:9443/stream?streams="
                    + "btcusdt@trade/btcusdt@ticker/"
                    + "ethusdt@trade/ethusdt@ticker/"
                    + "solusdt@trade/solusdt@ticker";
            container.connectToServer(this, URI.create(uri));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
