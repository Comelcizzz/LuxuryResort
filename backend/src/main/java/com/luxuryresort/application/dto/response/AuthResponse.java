package com.luxuryresort.application.dto.response;

public record AuthResponse(String accessToken, String refreshToken, UserResponse user) {
}
