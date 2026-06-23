package com.luxuryresort.domain.repository;

import com.luxuryresort.domain.entity.ServiceOrder;
import com.luxuryresort.domain.enums.OrderStatus;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public final class ServiceOrderSpecs {

    private ServiceOrderSpecs() {
    }

    public static Specification<ServiceOrder> listFilter(
            UUID userId,
            OrderStatus status,
            Instant from,
            Instant to,
            String q,
            boolean includeUserEmail
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (userId != null) {
                predicates.add(cb.equal(root.get("user").get("id"), userId));
            }
            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }
            if (from != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("appointmentDatetime"), from));
            }
            if (to != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("appointmentDatetime"), to));
            }
            if (q != null && !q.isBlank()) {
                String like = "%" + q.trim().toLowerCase() + "%";
                if (includeUserEmail) {
                    predicates.add(cb.or(
                            cb.like(cb.lower(root.get("service").get("name")), like),
                            cb.like(cb.lower(root.get("user").get("email")), like)
                    ));
                } else {
                    predicates.add(cb.like(cb.lower(root.get("service").get("name")), like));
                }
            }
            return cb.and(predicates.toArray(Predicate[]::new));
        };
    }
}
