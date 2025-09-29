package com.streaming.backend.controller;

import com.streaming.backend.service.KafkaMessageProducer;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class KafkaController {

    private final KafkaMessageProducer producer;

    public KafkaController(KafkaMessageProducer producer) {
        this.producer = producer;
    }

    @GetMapping("/publish")
    public String publishMessage(@RequestParam String message) {
        producer.sendMessage(message);
        return "📨 Message published: " + message;
    }
}