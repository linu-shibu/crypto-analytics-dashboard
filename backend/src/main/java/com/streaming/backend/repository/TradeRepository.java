package com.streaming.backend.repository;

import com.streaming.backend.model.Trade;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TradeRepository extends JpaRepository<Trade, Long> {
    Page<Trade> findBySymbolIgnoreCase(String symbol, Pageable pageable);

}

