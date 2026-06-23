package com.luxuryresort.domain.repository;

import com.luxuryresort.domain.entity.PricingRule;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.UUID;

public interface PricingRuleRepository extends JpaRepository<PricingRule, UUID>, JpaSpecificationExecutor<PricingRule> {

    List<PricingRule> findAllByActiveIsTrue(Sort sort);

    List<PricingRule> findAllByOrderByPriorityDescCreatedAtDesc();
}
