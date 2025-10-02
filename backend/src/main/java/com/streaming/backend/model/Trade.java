package com.streaming.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "trades")
public class Trade {

    @Id
    private Long tradeId;          // Binance trade id (t)
    private String symbol;         // s
    private double price;          // p
    private double quantity;       // q
    private long timestamp;        // E
    private boolean buyerMaker;    // m
}
