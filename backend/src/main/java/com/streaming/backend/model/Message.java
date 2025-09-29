package com.streaming.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Getters and Setters
    // (use Lombok @Data if you already have it set up)
    @Setter
    @Getter
    private String content;

    private String sender;

    private LocalDateTime timestamp;

    // Constructors
    public Message() {}

    public Message(String content, String sender, LocalDateTime timestamp) {
        this.content = content;
        this.sender = sender;
        this.timestamp = timestamp;
    }


}

