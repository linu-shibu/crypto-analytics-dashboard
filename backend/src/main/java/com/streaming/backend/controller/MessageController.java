package com.streaming.backend.controller;

import com.streaming.backend.dto.MessageDto;
import com.streaming.backend.model.Message;
import com.streaming.backend.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageRepository messageRepository;

    @GetMapping
    public Page<MessageDto> getMessages(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "timestamp") String sortBy,
            @RequestParam(defaultValue = "desc") String order
    ) {
        Sort sort = order.equalsIgnoreCase("asc") ?
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);

        return messageRepository.findAll(pageable)
                .map(message -> new MessageDto(
                        message.getId(),
                        message.getContent(),
                        message.getTimestamp()
                ));
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
