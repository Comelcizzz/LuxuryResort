package com.luxuryresort.application.service;

import com.luxuryresort.application.dto.response.PricingResult;

import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;

public interface DynamicPricingService {

    /**
     * Algorithm 1 — multiplicative model, weekend surge sub-formula, loyalty cap 15%.
     */
    PricingResult calculateDynamicPrice(UUID roomId, LocalDate checkIn, LocalDate checkOut, int loyaltyPointsToUse);

    /**
     * Значення для {@code bookings.pricing_snapshot} (JSONB).
     */
    Map<String, Object> toSnapshot(PricingResult result);
}
