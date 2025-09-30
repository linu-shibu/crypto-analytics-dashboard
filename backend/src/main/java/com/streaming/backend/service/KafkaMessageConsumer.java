package com.streaming.backend.service;

import com.streaming.backend.model.Message;
import com.streaming.backend.repository.MessageRepository;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class KafkaMessageConsumer {
    private final MessageRepository repository;
    private final StreamService streamService;

    public KafkaMessageConsumer(MessageRepository repository, StreamService streamService) {
        this.repository = repository;
        this.streamService = streamService;
    }

    @KafkaListener(topics = "messages", groupId = "demo-consumer")
    public void consume(String content) {
        Message message = new Message(
                content,
                "system-producer",                 // default sender
                LocalDateTime.now()                // capture timestamp
        );

        Message saved = repository.save(message);
        streamService.publish(saved); // push to SSE
        System.out.println("Message saved: " + message.getContent());
    }
}

