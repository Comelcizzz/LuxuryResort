package com.luxuryresort.application.dto.response;

/**
 * Після refresh повертається новий access; {@code refreshToken} — нова пара (rotation), щоб клієнт оновив збережений refresh.
 */
public record RefreshTokenResponse(String accessToken, String refreshToken) {
}
