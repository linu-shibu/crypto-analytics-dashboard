package com.streaming.backend.service;

import com.streaming.backend.dto.MessageDto;
import com.streaming.backend.model.Message;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Sinks;

@Service
public class StreamService {
    private final Sinks.Many<Message> sink = Sinks.many().multicast().onBackpressureBuffer();

    public void publish(Message message) {
        sink.tryEmitNext(message);
    }

    public Flux<ServerSentEvent<MessageDto>> stream() {
        return sink.asFlux().map(msg ->
                ServerSentEvent.builder(new MessageDto(msg.getId(), msg.getContent(), msg.getTimestamp())).build()
        );
    }
}

