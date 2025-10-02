package com.streaming.backend.config;

import com.streaming.backend.dto.CryptoPriceDto;
import com.streaming.backend.dto.TradeDto;
import com.streaming.backend.model.Trade;
import com.streaming.backend.model.CryptoPrice;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.support.serializer.JsonDeserializer;

import java.util.HashMap;
import java.util.Map;

@EnableKafka
@Configuration
public class KafkaConsumerConfig {

    // ✅ Consumer factory for Trades
//    @Bean
//    public ConsumerFactory<String, Trade> tradeConsumerFactory() {
//        Map<String, Object> config = new HashMap<>();
//        config.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
//        config.put(ConsumerConfig.GROUP_ID_CONFIG, "trades-group");
//        config.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
//
//        JsonDeserializer<Trade> jsonDeserializer = new JsonDeserializer<>(Trade.class);
//        jsonDeserializer.addTrustedPackages("*"); // allow all packages
//
//        return new DefaultKafkaConsumerFactory<>(config, new StringDeserializer(), jsonDeserializer);
//    }
//
//    @Bean
//    public ConcurrentKafkaListenerContainerFactory<String, Trade> tradeKafkaListenerContainerFactory() {
//        ConcurrentKafkaListenerContainerFactory<String, Trade> factory =
//                new ConcurrentKafkaListenerContainerFactory<>();
//        factory.setConsumerFactory(tradeConsumerFactory());
//        return factory;
//    }
    @Bean
    public ConsumerFactory<String, TradeDto> tradeDtoConsumerFactory() {
        Map<String, Object> config = new HashMap<>();
        config.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        config.put(ConsumerConfig.GROUP_ID_CONFIG, "trades-group");
        config.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);

        JsonDeserializer<TradeDto> deserializer = new JsonDeserializer<>(TradeDto.class);
        deserializer.addTrustedPackages("*");

        return new DefaultKafkaConsumerFactory<>(config, new StringDeserializer(), deserializer);
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, TradeDto> tradeDtoKafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, TradeDto> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(tradeDtoConsumerFactory());
        return factory;
    }


    // ✅ Consumer factory for Prices
    @Bean
    public ConsumerFactory<String, CryptoPriceDto> priceDtoConsumerFactory() {
        Map<String, Object> config = new HashMap<>();
        config.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        config.put(ConsumerConfig.GROUP_ID_CONFIG, "prices-group");
        config.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);

        JsonDeserializer<CryptoPriceDto> jsonDeserializer = new JsonDeserializer<>(CryptoPriceDto.class);
        jsonDeserializer.addTrustedPackages("*");

        return new DefaultKafkaConsumerFactory<>(config, new StringDeserializer(), jsonDeserializer);
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, CryptoPriceDto> priceDtoKafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, CryptoPriceDto> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(priceDtoConsumerFactory());
        return factory;
    }
}

