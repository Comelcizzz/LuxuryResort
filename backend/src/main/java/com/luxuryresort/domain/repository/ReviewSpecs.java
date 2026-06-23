package com.luxuryresort.domain.repository;

import com.luxuryresort.domain.entity.Review;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public final class ReviewSpecs {

    private ReviewSpecs() {
    }

    public static Specification<Review> searchFilter(
            boolean approved,
            UUID roomId,
            Integer ratingMin,
            Integer ratingMax,
            Instant from,
            Instant to,
            String q
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("approved"), approved));

            if (roomId != null) {
                predicates.add(cb.equal(root.get("room").get("id"), roomId));
            }
            if (ratingMin != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("rating"), ratingMin));
            }
            if (ratingMax != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("rating"), ratingMax));
            }
            if (from != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("createdAt"), from));
            }
            if (to != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("createdAt"), to));
            }
            if (q != null && !q.isBlank()) {
                String like = "%" + q.trim().toLowerCase() + "%";
                predicates.add(cb.like(cb.lower(root.get("comment")), like));
            }

            return cb.and(predicates.toArray(Predicate[]::new));
        };
    }
}
