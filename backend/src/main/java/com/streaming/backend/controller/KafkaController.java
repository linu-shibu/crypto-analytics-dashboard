package com.streaming.backend.controller;

import com.streaming.backend.model.MessageRequest;
import com.streaming.backend.service.KafkaMessageProducer;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class KafkaController {

    private final KafkaMessageProducer producerService;

    public KafkaController(KafkaMessageProducer producerService) {
        this.producerService = producerService;
    }

    @PostMapping("/publish")
    public ResponseEntity<String> publishMessage(@RequestBody MessageRequest request) {
        producerService.sendMessage(request.getContent());
        return ResponseEntity.ok("Message published successfully");
    }

}
