package com.streaming.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.streaming.backend.model.CryptoPrice;
import com.streaming.backend.model.CryptoPriceCH;
import com.streaming.backend.repository.CryptoPriceRepository;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Sinks;

@Service
public class PriceConsumer {

    private final CryptoPriceRepository priceRepo;
    private final Sinks.Many<CryptoPrice> priceSink;
//    private final ClickHouseService clickHouseService;

    public PriceConsumer(CryptoPriceRepository priceRepo, Sinks.Many<CryptoPrice> priceSink) {
        this.priceRepo = priceRepo;
        this.priceSink = priceSink;
    }

    @KafkaListener(topicPattern = "prices-.*", containerFactory = "priceDtoKafkaListenerContainerFactory")
    public void consumePrices(CryptoPrice price) {
        priceRepo.save(price);
        CryptoPriceCH chPrice = new CryptoPriceCH(price.getSymbol(), price.getPrice(), price.getTimestamp());
//        clickHouseService.savePrice(chPrice);
        priceSink.tryEmitNext(price);
        System.out.println("📥 Consumed Price: " + price);
    }
}

