package com.streaming.backend.dto;

import com.streaming.backend.model.CryptoPrice;

import java.time.LocalDateTime;

public class CryptoPriceDto {
    private Long id;
    private String symbol;
    private Double price;
    private LocalDateTime timestamp;

    public CryptoPriceDto(CryptoPrice entity) {
        this.id = entity.getId();
        this.symbol = entity.getSymbol();
        this.price = entity.getPrice();
        this.timestamp = entity.getTimestamp();
    }

    // Getters
    public Long getId() { return id; }
    public String getSymbol() { return symbol; }
    public Double getPrice() { return price; }
    public LocalDateTime getTimestamp() { return timestamp; }
}

