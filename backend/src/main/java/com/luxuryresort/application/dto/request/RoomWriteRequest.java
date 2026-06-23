package com.luxuryresort.application.dto.request;

import com.luxuryresort.domain.enums.RoomStatus;
import com.luxuryresort.domain.enums.RoomType;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.List;

public record RoomWriteRequest(
        @NotBlank @Size(max = 200) String name,
        @Size(max = 8000) String description,
        @NotNull @DecimalMin("0.01") BigDecimal basePricePerNight,
        @NotNull RoomType roomType,
        @Min(1) @Max(50) int maxOccupancy,
        @DecimalMin("0.0") BigDecimal sizeSqm,
        Integer floor,
        @NotBlank @Size(max = 10) String roomNumber,
        @NotNull RoomStatus status,
        @NotNull List<@Size(max = 200) String> amenities,
        @NotNull List<@Size(max = 2048) String> images
) {
}
