package com.luxuryresort.application.service.impl;

import com.luxuryresort.application.dto.response.AppliedRuleDto;
import com.luxuryresort.application.dto.response.PricingResult;
import com.luxuryresort.application.exception.ResourceNotFoundException;
import com.luxuryresort.application.service.DynamicPricingService;
import com.luxuryresort.domain.entity.PricingRule;
import com.luxuryresort.domain.entity.Room;
import com.luxuryresort.domain.enums.RuleType;
import com.luxuryresort.domain.repository.PricingRuleRepository;
import com.luxuryresort.domain.repository.RoomRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Clock;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class DynamicPricingServiceImpl implements DynamicPricingService {

    private final RoomRepository roomRepository;
    private final PricingRuleRepository pricingRuleRepository;
    private final Clock clock;

    public DynamicPricingServiceImpl(
            RoomRepository roomRepository,
            PricingRuleRepository pricingRuleRepository,
            Clock clock
    ) {
        this.roomRepository = roomRepository;
        this.pricingRuleRepository = pricingRuleRepository;
        this.clock = clock;
    }

    @Override
    @Transactional(readOnly = true)
    public PricingResult calculateDynamicPrice(UUID roomId, LocalDate checkIn, LocalDate checkOut, int loyaltyPointsToUse) {
        if (!checkOut.isAfter(checkIn)) {
            throw new IllegalArgumentException("checkOut must be after checkIn");
        }
        Room room = roomRepository.findByIdAndDeletedAtIsNull(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));
        long nights = ChronoUnit.DAYS.between(checkIn, checkOut);
        if (nights <= 0) {
            throw new IllegalArgumentException("Stay must be at least one night");
        }
        BigDecimal basePrice = room.getBasePricePerNight();
        BigDecimal baseTotal = basePrice.multiply(BigDecimal.valueOf(nights));

        List<PricingRule> rules = pricingRuleRepository.findAllByActiveIsTrue(Sort.by(Sort.Direction.DESC, "priority"));
        BigDecimal combinedMultiplier = BigDecimal.ONE;
        List<AppliedRuleDto> appliedRules = new ArrayList<>();
        LocalDate today = LocalDate.now(clock);

        for (PricingRule rule : rules) {
            if (!ruleApplies(rule, checkIn, checkOut, nights, today)) {
                continue;
            }
            if (rule.getRuleType() == RuleType.WEEKEND_SURGE) {
                BigDecimal effective = weekendSurgeMultiplier(rule.getMultiplier(), checkIn, checkOut, nights);
                combinedMultiplier = combinedMultiplier.multiply(effective);
                appliedRules.add(new AppliedRuleDto(rule.getName(), effective));
            } else {
                combinedMultiplier = combinedMultiplier.multiply(rule.getMultiplier());
                appliedRules.add(new AppliedRuleDto(rule.getName(), rule.getMultiplier()));
            }
        }

        BigDecimal loyaltyDiscount = loyaltyDiscountRate(0);
        BigDecimal finalTotal = baseTotal
                .multiply(combinedMultiplier)
                .multiply(BigDecimal.ONE.subtract(loyaltyDiscount))
                .setScale(2, RoundingMode.HALF_UP);

        int pointsEarned = finalTotal.setScale(0, RoundingMode.DOWN).intValue() / 100;

        return new PricingResult(
                baseTotal.setScale(2, RoundingMode.HALF_UP),
                finalTotal,
                combinedMultiplier.setScale(8, RoundingMode.HALF_UP),
                loyaltyDiscount.setScale(8, RoundingMode.HALF_UP),
                List.copyOf(appliedRules),
                pointsEarned
        );
    }

    @Override
    public Map<String, Object> toSnapshot(PricingResult result) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("baseTotal", result.baseTotal());
        map.put("finalTotal", result.finalTotal());
        map.put("combinedMultiplier", result.combinedMultiplier());
        map.put("loyaltyDiscount", result.loyaltyDiscount());
        map.put("pointsEarned", result.pointsEarned());
        List<Map<String, Object>> rules = new ArrayList<>();
        for (AppliedRuleDto r : result.appliedRules()) {
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("name", r.name());
            row.put("multiplier", r.multiplier());
            rules.add(row);
        }
        map.put("appliedRules", rules);
        return map;
    }

    private static BigDecimal loyaltyDiscountRate(int loyaltyPointsToUse) {
        int pts = Math.max(0, loyaltyPointsToUse);
        return BigDecimal.valueOf(pts)
                .divide(BigDecimal.valueOf(10_000), 8, RoundingMode.HALF_UP)
                .min(new BigDecimal("0.15"));
    }

    /**
     * M_weekend = 1 + weekendRatio × (surgeFactor − 1), surgeFactor = multiplier з правила.
     */
    private static BigDecimal weekendSurgeMultiplier(
            BigDecimal surgeFactor,
            LocalDate checkIn,
            LocalDate checkOut,
            long nights
    ) {
        int weekendNights = countWeekendNights(checkIn, checkOut);
        BigDecimal ratio = BigDecimal.valueOf(weekendNights)
                .divide(BigDecimal.valueOf(nights), 8, RoundingMode.HALF_UP);
        return BigDecimal.ONE.add(ratio.multiply(surgeFactor.subtract(BigDecimal.ONE)));
    }

    private static int countWeekendNights(LocalDate checkIn, LocalDate checkOut) {
        int count = 0;
        for (LocalDate d = checkIn; d.isBefore(checkOut); d = d.plusDays(1)) {
            DayOfWeek dow = d.getDayOfWeek();
            if (dow == DayOfWeek.SATURDAY || dow == DayOfWeek.SUNDAY) {
                count++;
            }
        }
        return count;
    }

    private static boolean ruleApplies(
            PricingRule rule,
            LocalDate checkIn,
            LocalDate checkOut,
            long nights,
            LocalDate today
    ) {
        return switch (rule.getRuleType()) {
            case SEASONAL -> seasonalOverlaps(checkIn, checkOut, rule.getStartDate(), rule.getEndDate());
            case WEEKEND_SURGE -> countWeekendNights(checkIn, checkOut) > 0;
            case LONG_STAY_DISCOUNT ->
                    rule.getMinNights() != null && nights >= rule.getMinNights();
            case EARLY_BIRD ->
                    rule.getDaysBeforeCheckin() != null
                            && ChronoUnit.DAYS.between(today, checkIn) >= rule.getDaysBeforeCheckin();
            case LAST_MINUTE ->
                    rule.getDaysBeforeCheckin() != null
                            && ChronoUnit.DAYS.between(today, checkIn) <= rule.getDaysBeforeCheckin();
        };
    }

    /**
     * Інтервал бронювання [checkIn, checkOut) перетинає сезон [start, end] включно по датах.
     */
    private static boolean seasonalOverlaps(
            LocalDate checkIn,
            LocalDate checkOut,
            LocalDate start,
            LocalDate end
    ) {
        if (start == null || end == null) {
            return false;
        }
        return checkIn.compareTo(end) <= 0 && checkOut.isAfter(start);
    }
}
