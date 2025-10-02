package com.streaming.backend.service;

import com.streaming.backend.dto.TradeDto;
import com.streaming.backend.model.Trade;
import com.streaming.backend.model.TradeCH;
import com.streaming.backend.repository.TradeRepository;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Sinks;

@Service
public class TradeConsumer {

    private final TradeRepository tradeRepo;
    private final Sinks.Many<Trade> tradeSink;
//    private final ClickHouseService clickHouseService;

    public TradeConsumer(TradeRepository tradeRepo, Sinks.Many<Trade> tradeSink) {
        this.tradeRepo = tradeRepo;
        this.tradeSink = tradeSink;
    }

    @KafkaListener(topicPattern = "trades-.*", containerFactory = "tradeDtoKafkaListenerContainerFactory")
    public void consumeTrades(Trade trade) {
        tradeRepo.save(trade);
        TradeCH chTrade = TradeCH.builder()
                .tradeId(trade.getTradeId())
                .symbol(trade.getSymbol())
                .price(trade.getPrice())
                .quantity(trade.getQuantity())
                .timestamp(trade.getTimestamp())
                .buyerMaker(trade.isBuyerMaker())
                .build();

        // ✅ Save to ClickHouse
//        clickHouseService.saveTrade(chTrade);
        tradeSink.tryEmitNext(trade);
        System.out.println("📥 Consumed Trade: " + trade);
    }


}
