package com.luxuryresort.domain.repository;

import com.luxuryresort.domain.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.lang.Nullable;

import java.util.List;
import java.util.UUID;

public interface ReviewRepository extends JpaRepository<Review, UUID>, JpaSpecificationExecutor<Review> {

    boolean existsByBooking_Id(UUID bookingId);

    @EntityGraph(attributePaths = {"room", "user", "booking"})
    Page<Review> findAll(@Nullable Specification<Review> spec, Pageable pageable);

    @Query("""
            select r.room.id, r.room.name, avg(r.sentimentScore)
            from Review r
            where r.approved = true and r.sentimentScore is not null
            group by r.room.id, r.room.name
            """)
    List<Object[]> averageSentimentByRoom();
}
