package com.streaming.backend.controller;

import com.streaming.backend.model.CryptoPrice;
import com.streaming.backend.model.Trade;
import com.streaming.backend.repository.CryptoPriceRepository;
import com.streaming.backend.repository.TradeRepository;
import com.streaming.backend.service.TickerService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Sinks;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/prices")
@RequiredArgsConstructor
public class CryptoPriceController {

    private final CryptoPriceRepository cryptoPriceRepository;
    private final Sinks.Many<CryptoPrice> priceSink;
    private final TickerService tickerService;

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
        return priceSink.asFlux().share();
    }

    // 🔹 Stream prices for a specific symbol
    @GetMapping(path = "/{symbol}/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<CryptoPrice> streamPricesBySymbol(@PathVariable String symbol) {
        return priceSink.asFlux()
                .filter(price -> price.getSymbol().equalsIgnoreCase(symbol)).share();
    }

    @GetMapping("/{symbol}/latest")
    public Map<String, Object> getLatest(@PathVariable String symbol) {
        // Get latest DB price
        CryptoPrice latest = cryptoPriceRepository.findTopBySymbolOrderByTimestampDesc(symbol);

        // Get cached 24h stats
        Map<String, Object> ticker = tickerService.getTicker(symbol);

        Map<String, Object> response = new HashMap<>();
        response.put("symbol", symbol);
        response.put("price", latest != null ? latest.getPrice() : null);
        response.put("change24h", ticker != null ? ticker.get("priceChangePercent") : null);
        response.put("volume24h", ticker != null ? ticker.get("volume") : null);

        return response;
    }
}

