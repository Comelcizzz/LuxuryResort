package com.luxuryresort.application.dto.response;

import java.math.BigDecimal;
import java.util.List;

/**
 * Output of {@code DynamicPricingService}; persisted as JSONB in {@code bookings.pricing_snapshot}.
 */
public record PricingResult(
        BigDecimal baseTotal,
        BigDecimal finalTotal,
        BigDecimal combinedMultiplier,
        BigDecimal loyaltyDiscount,
        List<AppliedRuleDto> appliedRules,
        int pointsEarned
) {
}
