package com.streaming.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.streaming.backend.model.TradeCH;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Service
@RequiredArgsConstructor
public class RawTradesConsumer {

//    private final ClickHouseService clickHouseService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    // Use a thread pool for async inserts (keeps Kafka consumption fast)
    private final ExecutorService executor = Executors.newFixedThreadPool(4);

    /**
     * Consume raw trades from Kafka and insert into ClickHouse
     */
    @KafkaListener(topics = {"raw-trades-btcusdt", "raw-trades-ethusdt", "raw-trades-solusdt"}, groupId = "raw-trades-group")
    public void consumeRawTrade(String message) {
        try {
            TradeCH trade = objectMapper.readValue(message, TradeCH.class);

            // Insert asynchronously
            executor.submit(() -> {
//                clickHouseService.saveTrade(trade);
//                System.out.println("💾 Stored raw trade in ClickHouse: " + trade);
            });

        } catch (Exception e) {
            System.err.println("❌ Error processing raw trade: " + e.getMessage());
        }
    }
}
