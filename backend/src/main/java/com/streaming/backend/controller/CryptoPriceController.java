package com.streaming.backend.controller;

import com.streaming.backend.model.CryptoPrice;
import com.streaming.backend.model.Trade;
import com.streaming.backend.repository.CryptoPriceRepository;
import com.streaming.backend.repository.TradeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Sinks;

@RestController
@RequestMapping("/api/prices")
@RequiredArgsConstructor
public class CryptoPriceController {

    private final CryptoPriceRepository cryptoPriceRepository;
    private final Sinks.Many<CryptoPrice> priceSink;

    @GetMapping
    public Page<CryptoPrice> getPrices(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "timestamp") String sortBy,
            @RequestParam(defaultValue = "desc") String order
    ) {
        Sort sort = order.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return cryptoPriceRepository.findAll(pageable);
    }

    @GetMapping("/{symbol}")
    public Page<CryptoPrice> getPricesBySymbol(
            @PathVariable String symbol,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            @RequestParam(defaultValue = "timestamp") String sortBy,
            @RequestParam(defaultValue = "desc") String order
    ) {
        Sort sort = order.equalsIgnoreCase("asc") ?
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return cryptoPriceRepository.findBySymbolIgnoreCase(symbol, pageable);
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

