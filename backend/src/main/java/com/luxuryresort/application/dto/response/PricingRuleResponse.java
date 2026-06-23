package com.luxuryresort.application.dto.response;

import com.luxuryresort.domain.enums.RuleType;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record PricingRuleResponse(
        UUID id,
        String name,
        RuleType ruleType,
        BigDecimal multiplier,
        LocalDate startDate,
        LocalDate endDate,
        Integer minNights,
        Integer daysBeforeCheckin,
        int priority,
        boolean active,
        Instant createdAt
) {
}
