package com.streaming.backend.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class TradeDto {
    @JsonProperty("t") private Long tradeId;
    @JsonProperty("s") private String symbol;
    @JsonProperty("p") private String price;
    @JsonProperty("q") private String quantity;
    @JsonProperty("E") private Long timestamp;
    @JsonProperty("m") private boolean buyerMaker;
}


