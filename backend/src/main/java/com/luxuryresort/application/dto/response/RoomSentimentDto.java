package com.luxuryresort.application.dto.response;

import java.math.BigDecimal;
import java.util.UUID;

public record RoomSentimentDto(UUID roomId, String roomName, BigDecimal averageSentiment) {
}
