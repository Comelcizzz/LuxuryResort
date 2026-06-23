package com.luxuryresort.application.dto.request;

import com.luxuryresort.domain.enums.ServiceCategory;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.List;

public record ServiceWriteRequest(
        @NotBlank @Size(max = 200) String name,
        @Size(max = 8000) String description,
        @NotNull ServiceCategory category,
        @NotNull @DecimalMin("0.0") BigDecimal price,
        @Min(0) Integer durationMinutes,
        @Min(1) @Max(100) int maxParticipants,
        @NotNull List<@Size(max = 2048) String> images,
        boolean available
) {
}
