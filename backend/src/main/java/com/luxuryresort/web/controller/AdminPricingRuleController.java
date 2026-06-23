package com.luxuryresort.web.controller;

import com.luxuryresort.application.dto.request.PricingRuleWriteRequest;
import com.luxuryresort.application.dto.response.PageResponse;
import com.luxuryresort.application.dto.response.PricingRuleResponse;
import com.luxuryresort.application.service.AdminPricingRuleService;
import com.luxuryresort.domain.enums.RuleType;
import com.luxuryresort.web.dto.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/admin/pricing-rules")
public class AdminPricingRuleController {

    private final AdminPricingRuleService adminPricingRuleService;

    public AdminPricingRuleController(AdminPricingRuleService adminPricingRuleService) {
        this.adminPricingRuleService = adminPricingRuleService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<PricingRuleResponse>>> list(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) RuleType ruleType,
            @RequestParam(required = false) Boolean active,
            @PageableDefault(size = 20, sort = "priority", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseEntity.ok(ApiResponse.ok(adminPricingRuleService.list(q, ruleType, active, pageable)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PricingRuleResponse>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok(adminPricingRuleService.getById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PricingRuleResponse>> create(@Valid @RequestBody PricingRuleWriteRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(adminPricingRuleService.create(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PricingRuleResponse>> update(
            @PathVariable UUID id,
            @Valid @RequestBody PricingRuleWriteRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.ok(adminPricingRuleService.update(id, request)));
    }
}
