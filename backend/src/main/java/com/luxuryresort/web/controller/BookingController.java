package com.luxuryresort.web.controller;

import com.luxuryresort.application.dto.request.CreateBookingRequest;
import com.luxuryresort.application.dto.request.PayBookingRequest;
import com.luxuryresort.application.dto.request.UpdateBookingStatusRequest;
import com.luxuryresort.application.dto.response.BookingResponse;
import com.luxuryresort.application.dto.response.PageResponse;
import com.luxuryresort.application.dto.response.PayBookingResponse;
import com.luxuryresort.application.exception.ResourceNotFoundException;
import com.luxuryresort.application.service.BookingService;
import com.luxuryresort.application.service.InvoiceService;
import com.luxuryresort.application.service.PaymentService;
import com.luxuryresort.domain.entity.User;
import com.luxuryresort.domain.enums.BookingStatus;
import com.luxuryresort.domain.repository.UserRepository;
import com.luxuryresort.web.dto.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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
import org.springframework.format.annotation.DateTimeFormat;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;
    private final PaymentService paymentService;
    private final InvoiceService invoiceService;
    private final UserRepository userRepository;

    public BookingController(
            BookingService bookingService,
            PaymentService paymentService,
            InvoiceService invoiceService,
            UserRepository userRepository
    ) {
        this.bookingService = bookingService;
        this.paymentService = paymentService;
        this.invoiceService = invoiceService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BookingResponse>> create(
            Authentication authentication,
            @Valid @RequestBody CreateBookingRequest request
    ) {
        User actor = requireUser(authentication);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(bookingService.create(request, actor)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<BookingResponse>>> list(
            Authentication authentication,
            @RequestParam(required = false) BookingStatus status,
            @RequestParam(required = false) Instant from,
            @RequestParam(required = false) Instant to,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkInFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkInTo,
            @RequestParam(required = false) String q,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        User actor = requireUser(authentication);
        return ResponseEntity.ok(ApiResponse.ok(
                bookingService.list(actor, status, from, to, checkInFrom, checkInTo, q, pageable)
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BookingResponse>> getById(Authentication authentication, @PathVariable UUID id) {
        User actor = requireUser(authentication);
        return ResponseEntity.ok(ApiResponse.ok(bookingService.getById(id, actor)));
    }

    @GetMapping("/{id}/invoice")
    public ResponseEntity<byte[]> invoice(Authentication authentication, @PathVariable UUID id) {
        User actor = requireUser(authentication);
        byte[] pdf = invoiceService.buildBookingInvoicePdf(id, actor);
        String slug = id.toString().replace("-", "").substring(0, 8).toUpperCase();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=LuxuryResort-cheque-" + slug + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @PostMapping("/{id}/pay")
    public ResponseEntity<ApiResponse<PayBookingResponse>> pay(
            Authentication authentication,
            @PathVariable UUID id,
            @Valid @RequestBody PayBookingRequest request
    ) {
        User actor = requireUser(authentication);
        return ResponseEntity.ok(ApiResponse.ok(paymentService.payBooking(id, request, actor)));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<BookingResponse>> updateStatus(
            Authentication authentication,
            @PathVariable UUID id,
            @Valid @RequestBody UpdateBookingStatusRequest request
    ) {
        User actor = requireUser(authentication);
        return ResponseEntity.ok(ApiResponse.ok(bookingService.updateStatus(id, request, actor)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        bookingService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private User requireUser(Authentication authentication) {
        return userRepository.findByEmailIgnoreCase(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
