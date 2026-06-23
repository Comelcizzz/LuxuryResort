package com.luxuryresort.web.controller;

import com.luxuryresort.web.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Loyalty feature removed from the product — keep route for old bookmarks with a clear 404.
 */
@RestController
@RequestMapping("/api/loyalty")
public class LoyaltyController {

    @GetMapping("/balance")
    public ResponseEntity<ApiResponse<Void>> balance() {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error("Функцію лояльності вимкнено"));
    }
}
