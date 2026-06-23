package com.luxuryresort.application.dto.request;

import com.luxuryresort.domain.enums.RuleType;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public record PricingRuleWriteRequest(
        @NotBlank @Size(max = 200) String name,
        @NotNull RuleType ruleType,
        @NotNull @DecimalMin("0.0001") BigDecimal multiplier,
        LocalDate startDate,
        LocalDate endDate,
        Integer minNights,
        Integer daysBeforeCheckin,
        int priority,
        boolean active
) {
}
