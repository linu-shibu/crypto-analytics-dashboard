package com.streaming.backend.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TickerService {
    private final RestTemplate restTemplate = new RestTemplate();
    private final Map<String, Map<String, Object>> cache = new ConcurrentHashMap<>();

    private static final String BINANCE_URL = "https://api.binance.com/api/v3/ticker/24hr?symbol=";

    @Scheduled(fixedRate = 60000) // every 1 minute
    public void refreshTickers() {
        for (String symbol : List.of("BTCUSDT", "ETHUSDT", "SOLUSDT")) {
            try {
                Map<String, Object> response = restTemplate.getForObject(BINANCE_URL + symbol, Map.class);
                cache.put(symbol, response);
            } catch (Exception e) {
                System.err.println("❌ Failed to fetch ticker for " + symbol + ": " + e.getMessage());
            }
        }
    }

    public Map<String, Object> getTicker(String symbol) {
        return cache.get(symbol);
    }
}
