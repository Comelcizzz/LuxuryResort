package com.luxuryresort.application.service.impl;

import com.luxuryresort.application.dto.response.LoyaltyBalanceResponse;
import com.luxuryresort.application.service.LoyaltyService;
import com.luxuryresort.domain.entity.User;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class LoyaltyServiceImpl implements LoyaltyService {

    @Override
    public LoyaltyBalanceResponse balance(User user) {
        int pts = Math.max(0, user.getLoyaltyPoints());
        BigDecimal rate = BigDecimal.valueOf(pts)
                .divide(BigDecimal.valueOf(10_000), 4, RoundingMode.HALF_UP)
                .min(new BigDecimal("0.15"));
        return new LoyaltyBalanceResponse(pts, rate);
    }
}
