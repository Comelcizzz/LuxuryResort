package com.luxuryresort.application.service.impl;

import com.luxuryresort.application.dto.request.CreateReviewRequest;
import com.luxuryresort.application.dto.response.PageResponse;
import com.luxuryresort.application.dto.response.ReviewResponse;
import com.luxuryresort.application.exception.ResourceNotFoundException;
import com.luxuryresort.application.mapper.ReviewMapper;
import com.luxuryresort.application.security.UserPermissions;
import com.luxuryresort.application.service.ReviewService;
import com.luxuryresort.application.support.SentimentAnalysis;
import com.luxuryresort.domain.entity.Booking;
import com.luxuryresort.domain.entity.Review;
import com.luxuryresort.domain.entity.User;
import com.luxuryresort.domain.enums.BookingStatus;
import com.luxuryresort.domain.repository.BookingRepository;
import com.luxuryresort.domain.repository.ReviewRepository;
import com.luxuryresort.domain.repository.ReviewSpecs;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.Instant;
import java.util.ArrayList;
import java.util.UUID;

@Service
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;
    private final ReviewMapper reviewMapper;
    private final Clock clock;

    public ReviewServiceImpl(
            ReviewRepository reviewRepository,
            BookingRepository bookingRepository,
            ReviewMapper reviewMapper,
            Clock clock
    ) {
        this.reviewRepository = reviewRepository;
        this.bookingRepository = bookingRepository;
        this.reviewMapper = reviewMapper;
        this.clock = clock;
    }

    @Override
    @Transactional
    public ReviewResponse create(CreateReviewRequest request, User actor) {
        if (reviewRepository.existsByBooking_Id(request.bookingId())) {
            throw new IllegalArgumentException("Review for this booking already exists");
        }
        Booking booking = bookingRepository.findWithRoomAndUserById(request.bookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        if (!booking.getUser().getId().equals(actor.getId())) {
            throw new IllegalArgumentException("Booking does not belong to the current user");
        }
        if (booking.getStatus() != BookingStatus.CHECKED_OUT && booking.getStatus() != BookingStatus.CHECKED_IN) {
            throw new IllegalArgumentException("Review is allowed after check-in or after checkout");
        }
        Instant now = clock.instant();
        Review review = Review.builder()
                .room(booking.getRoom())
                .user(actor)
                .booking(booking)
                .rating(request.rating())
                .comment(request.comment())
                .images(request.images() != null ? new ArrayList<>(request.images()) : new ArrayList<>())
                .sentimentScore(SentimentAnalysis.score(request.comment()))
                .approved(false)
                .createdAt(now)
                .build();
        return reviewMapper.toResponse(reviewRepository.save(review));
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ReviewResponse> list(
            UUID roomId,
            Boolean approvedFilter,
            Integer ratingMin,
            Integer ratingMax,
            Instant from,
            Instant to,
            String q,
            User actor,
            Pageable pageable
    ) {
        boolean approvedOnly = resolveApprovedFilter(approvedFilter, actor);
        return PageResponse.from(
                reviewRepository.findAll(
                                ReviewSpecs.searchFilter(approvedOnly, roomId, ratingMin, ratingMax, from, to, q),
                                pageable
                        )
                        .map(reviewMapper::toResponse)
        );
    }

    private boolean resolveApprovedFilter(Boolean requested, User actor) {
        if (requested == null || requested) {
            return true;
        }
        if (actor == null || !UserPermissions.isManagerOrAdmin(actor)) {
            return true;
        }
        return false;
    }

    @Override
    @Transactional
    public ReviewResponse approve(UUID id, User actor) {
        if (!UserPermissions.isManagerOrAdmin(actor)) {
            throw new IllegalArgumentException("Only manager or admin can approve reviews");
        }
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));
        review.setApproved(true);
        return reviewMapper.toResponse(reviewRepository.save(review));
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));
        reviewRepository.delete(review);
    }
}
