package com.luxuryresort.web.advice;

import com.luxuryresort.application.exception.BookingConflictException;
import com.luxuryresort.application.exception.PaymentDeclinedException;
import com.luxuryresort.application.exception.ResourceNotFoundException;
import com.luxuryresort.application.i18n.UserMessageUk;
import com.luxuryresort.web.dto.ApiResponse;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> notFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(UserMessageUk.translate(ex.getMessage())));
    }

    @ExceptionHandler(BookingConflictException.class)
    public ResponseEntity<ApiResponse<Void>> bookingConflict(BookingConflictException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ApiResponse.error(UserMessageUk.translate(ex.getMessage())));
    }

    @ExceptionHandler(PaymentDeclinedException.class)
    public ResponseEntity<ApiResponse<Void>> paymentDeclined(PaymentDeclinedException ex) {
        Map<String, String> errors = ex.getPaymentId() != null
                ? Map.of("paymentId", ex.getPaymentId().toString())
                : null;
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY)
                .body(ApiResponse.error(UserMessageUk.translate(ex.getMessage()), errors));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Void>> forbidden(AccessDeniedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error(UserMessageUk.translate(ex.getMessage())));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Void>> badRequest(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(ApiResponse.error(UserMessageUk.translate(ex.getMessage())));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> validation(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(fe ->
                errors.put(fe.getField(), UserMessageUk.translate(fe.getDefaultMessage())));
        return ResponseEntity.badRequest().body(ApiResponse.error(UserMessageUk.translate("Validation failed"), errors));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<Void>> conflict(DataIntegrityViolationException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(ApiResponse.error(UserMessageUk.translate("Data constraint violation")));
    }
}
