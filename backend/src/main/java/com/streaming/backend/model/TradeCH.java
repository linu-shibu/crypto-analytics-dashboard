package com.streaming.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TradeCH {
    private Long tradeId;       // trade unique ID (from Binance "t")
    private String symbol;      // e.g. BTCUSDT
    private double price;       // trade price
    private double quantity;    // trade quantity
    private long timestamp;     // event time (Binance "T")
    private boolean buyerMaker; // Binance "m" field
}

