package com.luxuryresort.application.service;

import com.luxuryresort.application.dto.response.LoyaltyBalanceResponse;
import com.luxuryresort.domain.entity.User;

public interface LoyaltyService {

    LoyaltyBalanceResponse balance(User user);
}
