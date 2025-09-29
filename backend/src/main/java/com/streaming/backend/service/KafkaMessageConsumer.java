package com.streaming.backend.service;

import com.streaming.backend.model.Message;
import com.streaming.backend.repository.MessageRepository;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class KafkaMessageConsumer {

    private final MessageRepository messageRepository;

    public KafkaMessageConsumer(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    @KafkaListener(topics = "messages", groupId = "demo-consumer")
    public void listen(String content) {
        Message msg = new Message();
        msg.setContent(content);
        msg.setSender("kafka");
        msg.setTimestamp(String.valueOf(System.currentTimeMillis()));

        messageRepository.save(msg);
        System.out.println("Saved message from Kafka: " + content);
    }
}


