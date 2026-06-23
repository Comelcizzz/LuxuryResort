package com.luxuryresort.application.service.impl;

import com.luxuryresort.application.dto.request.PricingRuleWriteRequest;
import com.luxuryresort.application.dto.response.PageResponse;
import com.luxuryresort.application.dto.response.PricingRuleResponse;
import com.luxuryresort.application.exception.ResourceNotFoundException;
import com.luxuryresort.application.mapper.PricingRuleMapper;
import com.luxuryresort.application.service.AdminPricingRuleService;
import com.luxuryresort.domain.entity.PricingRule;
import com.luxuryresort.domain.enums.RuleType;
import com.luxuryresort.domain.repository.PricingRuleRepository;
import com.luxuryresort.domain.repository.PricingRuleSpecs;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.Instant;
import java.util.UUID;

@Service
public class AdminPricingRuleServiceImpl implements AdminPricingRuleService {

    private final PricingRuleRepository pricingRuleRepository;
    private final PricingRuleMapper pricingRuleMapper;
    private final Clock clock;

    public AdminPricingRuleServiceImpl(
            PricingRuleRepository pricingRuleRepository,
            PricingRuleMapper pricingRuleMapper,
            Clock clock
    ) {
        this.pricingRuleRepository = pricingRuleRepository;
        this.pricingRuleMapper = pricingRuleMapper;
        this.clock = clock;
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<PricingRuleResponse> list(String q, RuleType ruleType, Boolean active, Pageable pageable) {
        return PageResponse.from(
                pricingRuleRepository.findAll(PricingRuleSpecs.searchFilter(q, ruleType, active), pageable)
                        .map(pricingRuleMapper::toResponse)
        );
    }

    @Override
    @Transactional(readOnly = true)
    public PricingRuleResponse getById(UUID id) {
        PricingRule rule = pricingRuleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pricing rule not found"));
        return pricingRuleMapper.toResponse(rule);
    }

    @Override
    @Transactional
    public PricingRuleResponse create(PricingRuleWriteRequest request) {
        Instant now = clock.instant();
        PricingRule entity = pricingRuleMapper.toEntity(request);
        entity.setCreatedAt(now);
        return pricingRuleMapper.toResponse(pricingRuleRepository.save(entity));
    }

    @Override
    @Transactional
    public PricingRuleResponse update(UUID id, PricingRuleWriteRequest request) {
        PricingRule rule = pricingRuleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pricing rule not found"));
        pricingRuleMapper.merge(request, rule);
        return pricingRuleMapper.toResponse(pricingRuleRepository.save(rule));
    }
}
