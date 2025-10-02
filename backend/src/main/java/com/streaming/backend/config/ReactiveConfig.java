package com.streaming.backend.config;

import com.streaming.backend.model.CryptoPrice;
import com.streaming.backend.model.Trade;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import reactor.core.publisher.Sinks;

@Configuration
public class ReactiveConfig {

    @Bean
    public Sinks.Many<Trade> tradeSink() {
        // replay(0) → no replay, only new events
        // multicast() → supports multiple subscribers
        return Sinks.many().multicast().onBackpressureBuffer();
    }

    @Bean
    public Sinks.Many<CryptoPrice> priceSink() {
        return Sinks.many().multicast().onBackpressureBuffer();
    }
}
