import type { UserRole } from "@/types/domain";

export function canAccessAdminAnalytics(role: UserRole | undefined): boolean {
  return role === "MANAGER" || role === "ADMIN";
}

export function canManageUsers(role: UserRole | undefined): boolean {
  return role === "MANAGER" || role === "ADMIN";
}

export function canChangeRoles(role: UserRole | undefined): boolean {
  return role === "ADMIN";
}

export function canViewAudit(role: UserRole | undefined): boolean {
  return role === "ADMIN";
}

export function canApproveReviews(role: UserRole | undefined): boolean {
  return role === "MANAGER" || role === "ADMIN";
}

/** Ресепшн: лише замовлення послуг (без /admin KPI). */
export function isReceptionist(role: UserRole | undefined): boolean {
  return role === "RECEPTIONIST";
}

export function canUpdateServiceOrderStatus(role: UserRole | undefined): boolean {
  return role === "RECEPTIONIST" || role === "MANAGER" || role === "ADMIN";
}

export function canManageRoomsAndServices(role: UserRole | undefined): boolean {
  return role === "MANAGER" || role === "ADMIN";
}

export function canDeleteRoomsAndServices(role: UserRole | undefined): boolean {
  return role === "ADMIN";
}
