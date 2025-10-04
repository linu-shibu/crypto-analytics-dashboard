package com.streaming.backend.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaTopicConfig {

    // Trade topics
    @Bean
    public NewTopic tradesBtc() {
        return TopicBuilder.name("trades-btcusdt")
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic tradesEth() {
        return TopicBuilder.name("trades-ethusdt")
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic tradesSol() {
        return TopicBuilder.name("trades-solusdt")
                .partitions(3)
                .replicas(1)
                .build();
    }

    // Price topics
    @Bean
    public NewTopic pricesBtc() {
        return TopicBuilder.name("prices-btcusdt")
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic pricesEth() {
        return TopicBuilder.name("prices-ethusdt")
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic pricesSol() {
        return TopicBuilder.name("prices-solusdt")
                .partitions(3)
                .replicas(1)
                .build();
    }
}
