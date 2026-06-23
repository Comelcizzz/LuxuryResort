package com.luxuryresort.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Ensures Render static site → API cross-origin requests succeed even if Spring Security
 * rejects the preflight before the default CORS filter runs.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class RenderCorsFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        String origin = request.getHeader(HttpHeaders.ORIGIN);
        if (origin != null && isAllowedOrigin(origin)) {
            response.setHeader(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, origin);
            response.setHeader(HttpHeaders.ACCESS_CONTROL_ALLOW_CREDENTIALS, "true");
            response.setHeader(HttpHeaders.VARY, HttpHeaders.ORIGIN);

            if (HttpMethod.OPTIONS.matches(request.getMethod())) {
                String requestMethod = request.getHeader(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD);
                String requestHeaders = request.getHeader(HttpHeaders.ACCESS_CONTROL_REQUEST_HEADERS);
                if (requestMethod != null) {
                    response.setHeader(HttpHeaders.ACCESS_CONTROL_ALLOW_METHODS, requestMethod);
                } else {
                    response.setHeader(HttpHeaders.ACCESS_CONTROL_ALLOW_METHODS,
                            "GET, POST, PUT, PATCH, DELETE, OPTIONS");
                }
                if (requestHeaders != null) {
                    response.setHeader(HttpHeaders.ACCESS_CONTROL_ALLOW_HEADERS, requestHeaders);
                } else {
                    response.setHeader(HttpHeaders.ACCESS_CONTROL_ALLOW_HEADERS, "*");
                }
                response.setHeader(HttpHeaders.ACCESS_CONTROL_MAX_AGE, "3600");
                response.setStatus(HttpServletResponse.SC_OK);
                return;
            }
        }
        filterChain.doFilter(request, response);
    }

    private static boolean isAllowedOrigin(String origin) {
        return origin.startsWith("http://localhost:")
                || origin.startsWith("http://127.0.0.1:")
                || (origin.startsWith("https://") && origin.endsWith(".onrender.com"));
    }
}
