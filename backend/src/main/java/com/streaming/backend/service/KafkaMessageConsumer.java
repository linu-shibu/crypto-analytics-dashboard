package com.streaming.backend.service;

import com.streaming.backend.model.Message;
import com.streaming.backend.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class KafkaMessageConsumer {

    @Autowired
    private MessageRepository messageRepository;

    @KafkaListener(topics = "messages", groupId = "demo-consumer")
    public void consume(String content) {
        Message message = new Message(
                content,
                "system-producer",                 // default sender
                LocalDateTime.now()                // capture timestamp
        );
        messageRepository.save(message);
        System.out.println("Message saved: " + message.getContent());
    }
}


