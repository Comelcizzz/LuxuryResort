package com.luxuryresort.application.service;

import com.luxuryresort.application.dto.request.LoginRequest;
import com.luxuryresort.application.dto.request.RefreshTokenRequest;
import com.luxuryresort.application.dto.request.RegisterRequest;
import com.luxuryresort.application.dto.request.UpdateProfileRequest;
import com.luxuryresort.application.dto.response.AuthResponse;
import com.luxuryresort.application.dto.response.RefreshTokenResponse;
import com.luxuryresort.application.dto.response.UserResponse;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    RefreshTokenResponse refresh(RefreshTokenRequest request);

    void logout(String userEmail);

    UserResponse getMe(String userEmail);

    UserResponse updateMe(String userEmail, UpdateProfileRequest request);
}
