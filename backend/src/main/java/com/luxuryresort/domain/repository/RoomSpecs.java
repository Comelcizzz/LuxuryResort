package com.luxuryresort.domain.repository;

import com.luxuryresort.domain.entity.Room;
import com.luxuryresort.domain.enums.RoomStatus;
import com.luxuryresort.domain.enums.RoomType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public final class RoomSpecs {

    private RoomSpecs() {
    }

    /**
     * Фільтр {@code available=true} — лише номери зі статусом {@link RoomStatus#AVAILABLE}.
     * Для перевірки дат використовуйте {@code /availability}.
     */
    public static Specification<Room> catalogFilter(
            String q,
            RoomType type,
            BigDecimal priceMin,
            BigDecimal priceMax,
            Integer maxOccupancy,
            Boolean available
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.isNull(root.get("deletedAt")));
            predicates.add(cb.or(
                    cb.isNull(root.get("description")),
                    cb.notLike(root.get("description"), "Демо-номер для заповнення каталогу%")
            ));
            if (type != null) {
                predicates.add(cb.equal(root.get("roomType"), type));
            }
            if (q != null && !q.isBlank()) {
                String like = "%" + q.trim().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("name")), like),
                        cb.like(cb.lower(root.get("description")), like),
                        cb.like(cb.lower(root.get("roomNumber")), like)
                ));
            }
            if (priceMin != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("basePricePerNight"), priceMin));
            }
            if (priceMax != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("basePricePerNight"), priceMax));
            }
            if (maxOccupancy != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("maxOccupancy"), maxOccupancy));
            }
            if (Boolean.TRUE.equals(available)) {
                predicates.add(cb.equal(root.get("status"), RoomStatus.AVAILABLE));
            } else if (Boolean.FALSE.equals(available)) {
                predicates.add(cb.notEqual(root.get("status"), RoomStatus.AVAILABLE));
            }
            return cb.and(predicates.toArray(Predicate[]::new));
        };
    }
}
