package com.streaming.backend.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import com.streaming.backend.dto.CryptoPriceDto;
import com.streaming.backend.model.CryptoPrice;
import com.streaming.backend.repository.CryptoPriceRepository;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

@Service
public class CryptoConsumer {
    private final CryptoPriceRepository repo;
    private final StreamService streamService;
    private final ClickHouseService clickHouseService;
    private final ObjectMapper mapper = new ObjectMapper();

    public CryptoConsumer(CryptoPriceRepository repo,
                          StreamService streamService,
                          ClickHouseService clickHouseService) {
        this.repo = repo;
        this.streamService = streamService;
        this.clickHouseService = clickHouseService;
    }

    @KafkaListener(topics = "crypto-prices", groupId = "crypto-group")
    public void consume(String json) throws Exception {
        System.out.println("📥 Consumed from Kafka: " + json);

        Map<String, Object> root = mapper.readValue(json, new TypeReference<>() {});
        Map<String, Object> data = (Map<String, Object>) root.get("data");

        if (data == null) {
            System.err.println("⚠️ Skipping message without 'data': " + json);
            return;
        }

        String symbol = (String) data.get("s");   // e.g., "BTCUSDT"
        String rawPrice = (String) data.get("p"); // price string
        Double price = Double.valueOf(rawPrice);
        LocalDateTime now = LocalDateTime.now();

        // Save into MySQL
        CryptoPrice entity = new CryptoPrice(null, symbol, price, now);
        CryptoPrice saved = repo.save(entity);

        // Save into ClickHouse
        clickHouseService.savePrice(symbol, price, now);

        // Publish to SSE
        streamService.publish(new CryptoPriceDto(saved));
    }

}


