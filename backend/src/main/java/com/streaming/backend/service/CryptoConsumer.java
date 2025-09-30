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
    private final ObjectMapper mapper = new ObjectMapper();

    public CryptoConsumer(CryptoPriceRepository repo, StreamService streamService) {
        this.repo = repo;
        this.streamService = streamService;
    }

    @KafkaListener(topics = "crypto-prices", groupId = "crypto-group")
    public void consume(String json) throws Exception {
        Map<String, String> map = mapper.readValue(json, new TypeReference<>() {});
        LocalDateTime now = LocalDateTime.now();

        for (Map.Entry<String, String> entry : map.entrySet()) {
            CryptoPrice price = new CryptoPrice();
            price.setSymbol(entry.getKey());
            price.setPrice(Double.valueOf(entry.getValue()));
            price.setTimestamp(now);

            CryptoPrice saved = repo.save(price);
            streamService.publish(new CryptoPriceDto(saved));
        }
    }
}

