package com.streaming.backend.controller;

import com.streaming.backend.dto.CryptoPriceDto;
import com.streaming.backend.repository.CryptoPriceRepository;
import org.springframework.data.domain.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/prices")
public class CryptoController {
    private final CryptoPriceRepository repo;

    public CryptoController(CryptoPriceRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public Page<CryptoPriceDto> getPrices(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "timestamp") String sortBy,
            @RequestParam(defaultValue = "desc") String order
    ) {
        Sort sort = order.equalsIgnoreCase("asc") ?
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        return repo.findAll(pageable).map(CryptoPriceDto::new);
    }
}
