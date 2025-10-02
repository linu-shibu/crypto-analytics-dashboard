package com.streaming.backend.controller;

import com.streaming.backend.model.CryptoPrice;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Sinks;

@RestController
@RequestMapping("/api/prices")
public class CryptoPriceController {

    private final Sinks.Many<CryptoPrice> priceSink;

    public CryptoPriceController(Sinks.Many<CryptoPrice> priceSink) {
        this.priceSink = priceSink;
    }

    // 🔹 Stream ALL prices
    @GetMapping(path = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<CryptoPrice> streamPrices() {
        return priceSink.asFlux();
    }

    // 🔹 Stream prices for a specific symbol
    @GetMapping(path = "/{symbol}/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<CryptoPrice> streamPricesBySymbol(@PathVariable String symbol) {
        return priceSink.asFlux()
                .filter(price -> price.getSymbol().equalsIgnoreCase(symbol));
    }
}

