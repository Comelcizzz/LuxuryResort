package com.luxuryresort.application.service.impl;

import com.luxuryresort.application.dto.request.LoginRequest;
import com.luxuryresort.application.dto.request.RefreshTokenRequest;
import com.luxuryresort.application.dto.request.RegisterRequest;
import com.luxuryresort.application.dto.request.UpdateProfileRequest;
import com.luxuryresort.application.dto.response.AuthResponse;
import com.luxuryresort.application.dto.response.RefreshTokenResponse;
import com.luxuryresort.application.dto.response.UserResponse;
import com.luxuryresort.application.exception.DuplicateEmailException;
import com.luxuryresort.application.exception.InvalidRefreshTokenException;
import com.luxuryresort.application.mapper.UserMapper;
import com.luxuryresort.application.service.AuthService;
import com.luxuryresort.config.JwtProperties;
import com.luxuryresort.domain.entity.RefreshToken;
import com.luxuryresort.domain.entity.User;
import com.luxuryresort.domain.repository.RefreshTokenRepository;
import com.luxuryresort.domain.repository.UserRepository;
import com.luxuryresort.infrastructure.security.JwtService;
import com.luxuryresort.infrastructure.security.TokenHasher;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@Transactional
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final JwtProperties jwtProperties;
    private final UserMapper userMapper;

    public AuthServiceImpl(
            UserRepository userRepository,
            RefreshTokenRepository refreshTokenRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            JwtProperties jwtProperties,
            UserMapper userMapper
    ) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.jwtProperties = jwtProperties;
        this.userMapper = userMapper;
    }

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmailIgnoreCase(request.email()).isPresent()) {
            throw new DuplicateEmailException(request.email());
        }
        User user = userMapper.toNewUser(request);
        Instant now = Instant.now();
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setCreatedAt(now);
        user.setUpdatedAt(now);
        userRepository.save(user);
        return issueAuthResponse(user);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmailIgnoreCase(request.email())
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));
        if (!user.isActive()) {
            throw new DisabledException("Account disabled");
        }
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid credentials");
        }
        refreshTokenRepository.revokeAllActiveForUser(user.getId());
        return issueAuthResponse(user);
    }

    @Override
    public RefreshTokenResponse refresh(RefreshTokenRequest request) {
        String raw = request.refreshToken().trim();
        Claims claims;
        try {
            claims = jwtService.parseAndValidate(raw, JwtService.TYPE_REFRESH);
        } catch (JwtException e) {
            throw new InvalidRefreshTokenException();
        }
        String hash = TokenHasher.sha256Hex(raw);
        RefreshToken stored = refreshTokenRepository.findByTokenHashAndRevokedFalse(hash)
                .orElseThrow(InvalidRefreshTokenException::new);
        if (stored.getExpiresAt().isBefore(Instant.now())) {
            throw new InvalidRefreshTokenException();
        }
        UUID userId = jwtService.extractUserId(claims);
        if (!stored.getUser().getId().equals(userId)) {
            throw new InvalidRefreshTokenException();
        }
        User user = userRepository.findById(userId).orElseThrow(InvalidRefreshTokenException::new);
        if (!user.isActive()) {
            throw new InvalidRefreshTokenException();
        }
        stored.setRevoked(true);
        refreshTokenRepository.save(stored);

        String access = jwtService.createAccessToken(user);
        String newRefresh = persistRefreshToken(user);
        return new RefreshTokenResponse(access, newRefresh);
    }

    @Override
    public void logout(String userEmail) {
        User user = userRepository.findByEmailIgnoreCase(userEmail)
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));
        refreshTokenRepository.revokeAllActiveForUser(user.getId());
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getMe(String userEmail) {
        User user = userRepository.findByEmailIgnoreCase(userEmail)
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));
        return userMapper.toResponse(user);
    }

    @Override
    public UserResponse updateMe(String userEmail, UpdateProfileRequest request) {
        User user = userRepository.findByEmailIgnoreCase(userEmail)
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));
        userMapper.merge(request, user);
        user.setUpdatedAt(Instant.now());
        return userMapper.toResponse(userRepository.save(user));
    }

    private AuthResponse issueAuthResponse(User user) {
        String access = jwtService.createAccessToken(user);
        String refresh = persistRefreshToken(user);
        return new AuthResponse(access, refresh, userMapper.toResponse(user));
    }

    private String persistRefreshToken(User user) {
        String jti = UUID.randomUUID().toString();
        String refresh = jwtService.createRefreshToken(user, jti);
        String hash = TokenHasher.sha256Hex(refresh);
        Instant now = Instant.now();
        Instant expiresAt = now.plus(jwtProperties.refreshTokenTtl());
        RefreshToken row = RefreshToken.builder()
                .user(user)
                .tokenHash(hash)
                .expiresAt(expiresAt)
                .revoked(false)
                .createdAt(now)
                .build();
        refreshTokenRepository.save(row);
        return refresh;
    }
}
