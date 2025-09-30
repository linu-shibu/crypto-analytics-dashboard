package com.streaming.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "crypto_prices")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CryptoPrice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Getter
    @Setter
    private String symbol;

    @Getter
    @Setter
    private Double price;

    @Getter
    @Setter
    private LocalDateTime timestamp;

}