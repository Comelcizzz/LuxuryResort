package com.luxuryresort.web.controller;

import com.luxuryresort.application.dto.request.CreateReviewRequest;
import com.luxuryresort.application.dto.response.PageResponse;
import com.luxuryresort.application.dto.response.ReviewResponse;
import com.luxuryresort.application.exception.ResourceNotFoundException;
import com.luxuryresort.application.service.ReviewService;
import com.luxuryresort.domain.entity.User;
import com.luxuryresort.domain.repository.UserRepository;
import com.luxuryresort.web.dto.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.UUID;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;
    private final UserRepository userRepository;

    public ReviewController(ReviewService reviewService, UserRepository userRepository) {
        this.reviewService = reviewService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<ReviewResponse>>> list(
            @RequestParam(required = false) UUID roomId,
            @RequestParam(required = false) Boolean approved,
            @RequestParam(required = false) Integer ratingMin,
            @RequestParam(required = false) Integer ratingMax,
            @RequestParam(required = false) Instant from,
            @RequestParam(required = false) Instant to,
            @RequestParam(required = false) String q,
            Authentication authentication,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        User actor = optionalUser(authentication);
        return ResponseEntity.ok(ApiResponse.ok(
                reviewService.list(roomId, approved, ratingMin, ratingMax, from, to, q, actor, pageable)
        ));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ReviewResponse>> create(
            Authentication authentication,
            @Valid @RequestBody CreateReviewRequest request
    ) {
        User actor = requireUser(authentication);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(reviewService.create(request, actor)));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<ApiResponse<ReviewResponse>> approve(Authentication authentication, @PathVariable UUID id) {
        User actor = requireUser(authentication);
        return ResponseEntity.ok(ApiResponse.ok(reviewService.approve(id, actor)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        reviewService.delete(id);
        return ResponseEntity.noContent().build();
    }

    private User requireUser(Authentication authentication) {
        return userRepository.findByEmailIgnoreCase(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private User optionalUser(Authentication authentication) {
        if (authentication == null
                || !authentication.isAuthenticated()
                || authentication instanceof AnonymousAuthenticationToken) {
            return null;
        }
        return userRepository.findByEmailIgnoreCase(authentication.getName()).orElse(null);
    }
}
