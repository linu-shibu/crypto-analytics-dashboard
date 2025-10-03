package com.streaming.backend.repository;

import com.streaming.backend.model.CryptoPrice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CryptoPriceRepository extends JpaRepository<CryptoPrice, Long> {
    Page<CryptoPrice> findBySymbolIgnoreCase(String symbol, Pageable pageable);
    CryptoPrice findTopBySymbolOrderByTimestampDesc(String symbol);
}


