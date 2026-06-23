package com.luxuryresort.domain.repository;

import com.luxuryresort.domain.entity.PricingRule;
import com.luxuryresort.domain.enums.RuleType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public final class PricingRuleSpecs {

    private PricingRuleSpecs() {
    }

    public static Specification<PricingRule> searchFilter(String q, RuleType ruleType, Boolean active) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (q != null && !q.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("name")), "%" + q.trim().toLowerCase() + "%"));
            }
            if (ruleType != null) {
                predicates.add(cb.equal(root.get("ruleType"), ruleType));
            }
            if (active != null) {
                predicates.add(cb.equal(root.get("active"), active));
            }
            return cb.and(predicates.toArray(Predicate[]::new));
        };
    }
}
