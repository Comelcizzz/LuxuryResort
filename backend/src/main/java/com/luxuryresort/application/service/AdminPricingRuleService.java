package com.luxuryresort.application.service;

import com.luxuryresort.application.dto.request.PricingRuleWriteRequest;
import com.luxuryresort.application.dto.response.PageResponse;
import com.luxuryresort.application.dto.response.PricingRuleResponse;
import com.luxuryresort.domain.enums.RuleType;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface AdminPricingRuleService {

    PageResponse<PricingRuleResponse> list(String q, RuleType ruleType, Boolean active, Pageable pageable);

    PricingRuleResponse getById(UUID id);

    PricingRuleResponse create(PricingRuleWriteRequest request);

    PricingRuleResponse update(UUID id, PricingRuleWriteRequest request);
}
