package com.streaming.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "crypto_prices")
public class CryptoPrice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String symbol;      // BTCUSDT
    private double price;       // latest price
    private long timestamp;     // event time (Binance 'E')
}
