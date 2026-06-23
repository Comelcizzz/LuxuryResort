package com.luxuryresort.application.dto.request;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
        @Size(max = 100) String firstName,
        @Size(max = 100) String lastName,
        @Size(max = 20)
        @Pattern(regexp = "^$|^\\+?[0-9\\s\\-()]+$", message = "Invalid phone format")
        String phone
) {
}
