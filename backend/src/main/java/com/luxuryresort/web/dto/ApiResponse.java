package com.luxuryresort.web.dto;

import java.util.Map;

/**
 * Global API envelope (see promt.md). Controllers return this from F17 onward.
 */
public record ApiResponse<T>(boolean success, T data, String message, Map<String, String> errors) {

    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(true, data, null, null);
    }

    public static <T> ApiResponse<T> error(String msg, Map<String, String> errors) {
        return new ApiResponse<>(false, null, msg, errors);
    }

    public static <T> ApiResponse<T> error(String msg) {
        return new ApiResponse<>(false, null, msg, null);
    }
}
