package com.luxuryresort.application.service;

import com.luxuryresort.application.dto.request.CreateReviewRequest;
import com.luxuryresort.application.dto.response.PageResponse;
import com.luxuryresort.application.dto.response.ReviewResponse;
import com.luxuryresort.domain.entity.User;
import org.springframework.data.domain.Pageable;

import java.time.Instant;
import java.util.UUID;

public interface ReviewService {

    ReviewResponse create(CreateReviewRequest request, User actor);

    PageResponse<ReviewResponse> list(
            UUID roomId,
            Boolean approvedFilter,
            Integer ratingMin,
            Integer ratingMax,
            Instant from,
            Instant to,
            String q,
            User actor,
            Pageable pageable
    );

    ReviewResponse approve(UUID id, User actor);

    void delete(UUID id);
}
