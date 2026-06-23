package com.luxuryresort.application.dto.response;

import java.math.BigDecimal;

public record LoyaltyBalanceResponse(int points, BigDecimal equivalentDiscount) {
}
