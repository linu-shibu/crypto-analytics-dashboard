package com.streaming.backend.controller;

import com.streaming.backend.model.Message;
import com.streaming.backend.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/messages")
public class MessageController {

    @Autowired
    private MessageRepository messageRepository;

    // Get all messages
    @GetMapping
    public List<Message> getAllMessages() {
        return messageRepository.findAll();
    }

    // Filter by sender
    @GetMapping("/sender/{sender}")
    public List<Message> getMessagesBySender(@PathVariable String sender) {
        return messageRepository.findBySender(sender);
    }

    // Filter by keyword in content
    @GetMapping("/search")
    public List<Message> searchMessages(@RequestParam String keyword) {
        return messageRepository.findByContentContaining(keyword);
    }
}
