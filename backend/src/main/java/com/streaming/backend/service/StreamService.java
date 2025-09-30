package com.streaming.backend.service;

import com.streaming.backend.dto.CryptoPriceDto;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Sinks;

@Service
public class StreamService {
    private final Sinks.Many<CryptoPriceDto> sink = Sinks.many().multicast().onBackpressureBuffer();

    public void publish(CryptoPriceDto dto) {
        sink.tryEmitNext(dto);
    }

    public Flux<ServerSentEvent<CryptoPriceDto>> stream() {
        return sink.asFlux().map(dto -> ServerSentEvent.builder(dto).build());
    }
}

