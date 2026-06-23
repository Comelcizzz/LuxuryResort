package com.luxuryresort.domain.repository;

import com.luxuryresort.domain.entity.Booking;
import com.luxuryresort.domain.enums.BookingStatus;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public final class BookingSpecs {

    private BookingSpecs() {
    }

    public static Specification<Booking> listFilter(
            UUID userId,
            BookingStatus status,
            Instant from,
            Instant to,
            LocalDate checkInFrom,
            LocalDate checkInTo,
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
                predicates.add(cb.greaterThanOrEqualTo(root.get("createdAt"), from));
            }
            if (to != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("createdAt"), to));
            }
            if (checkInFrom != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("checkInDate"), checkInFrom));
            }
            if (checkInTo != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("checkInDate"), checkInTo));
            }
            if (q != null && !q.isBlank()) {
                String like = "%" + q.trim().toLowerCase() + "%";
                if (includeUserEmail) {
                    predicates.add(cb.or(
                            cb.like(cb.lower(root.get("room").get("name")), like),
                            cb.like(cb.lower(root.get("room").get("roomNumber")), like),
                            cb.like(cb.lower(root.get("user").get("email")), like)
                    ));
                } else {
                    predicates.add(cb.or(
                            cb.like(cb.lower(root.get("room").get("name")), like),
                            cb.like(cb.lower(root.get("room").get("roomNumber")), like)
                    ));
                }
            }
            return cb.and(predicates.toArray(Predicate[]::new));
        };
    }
}
