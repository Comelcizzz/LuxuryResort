package com.luxuryresort.application.security;

import com.luxuryresort.domain.entity.User;
import com.luxuryresort.domain.enums.UserRole;

public final class UserPermissions {

    private UserPermissions() {
    }

    public static boolean isStaff(User user) {
        return user != null && isStaff(user.getRole());
    }

    public static boolean isStaff(UserRole role) {
        return role == UserRole.RECEPTIONIST || role == UserRole.MANAGER || role == UserRole.ADMIN;
    }

    public static boolean isManagerOrAdmin(User user) {
        return user != null && (user.getRole() == UserRole.MANAGER || user.getRole() == UserRole.ADMIN);
    }
}
