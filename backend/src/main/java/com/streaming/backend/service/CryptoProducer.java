package com.streaming.backend.service;

import jakarta.annotation.PostConstruct;
import jakarta.websocket.*;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.net.URI;

@Service
@ClientEndpoint
public class CryptoProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private static final String TOPIC = "crypto-prices";

    public CryptoProducer(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    @OnOpen
    public void onOpen(Session session) {
        System.out.println("✅ Connected to Binance WebSocket");
    }

    @OnMessage
    public void onMessage(String message) {
        System.out.println("💹 Incoming Binance message: " + message);

        // Forward raw Binance payload to Kafka
        kafkaTemplate.send(TOPIC, message);
    }

    @OnError
    public void onError(Session session, Throwable throwable) {
        System.err.println("❌ Binance WebSocket error: " + throwable.getMessage());
    }

    @OnClose
    public void onClose(Session session, CloseReason closeReason) {
        System.out.println("🔌 Binance WebSocket closed: " + closeReason);
    }

    @PostConstruct
    public void start() {
        try {
//            WebSocketContainer container = ContainerProvider.getWebSocketContainer();
//            // Multi-stream: BTC, ETH, SOL
//            String uri = "wss://stream.binance.com:9443/stream?streams=btcusdt@trade/ethusdt@trade/solusdt@trade";
//            container.connectToServer(this, URI.create(uri));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

