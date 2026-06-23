package com.luxuryresort.domain.repository;

import com.luxuryresort.domain.entity.ServiceEntity;
import com.luxuryresort.domain.enums.ServiceCategory;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public final class ServiceSpecs {

    private ServiceSpecs() {
    }

    public static Specification<ServiceEntity> catalogFilter(
            String q,
            ServiceCategory category,
            Boolean available,
            BigDecimal priceMin,
            BigDecimal priceMax,
            Integer durationMin,
            Integer durationMax
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.isNull(root.get("deletedAt")));

            if (q != null && !q.isBlank()) {
                String like = "%" + q.trim().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("name")), like),
                        cb.like(cb.lower(root.get("description")), like)
                ));
            }
            if (category != null) {
                predicates.add(cb.equal(root.get("category"), category));
            }
            if (available != null) {
                predicates.add(cb.equal(root.get("available"), available));
            }
            if (priceMin != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), priceMin));
            }
            if (priceMax != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), priceMax));
            }
            if (durationMin != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("durationMinutes"), durationMin));
            }
            if (durationMax != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("durationMinutes"), durationMax));
            }

            return cb.and(predicates.toArray(Predicate[]::new));
        };
    }
}
