export const UserRole = {
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  RECEPTIONIST: "RECEPTIONIST",
  GUEST: "GUEST",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const BookingStatus = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  CHECKED_IN: "CHECKED_IN",
  CHECKED_OUT: "CHECKED_OUT",
  CANCELLED: "CANCELLED",
  NO_SHOW: "NO_SHOW",
} as const;

export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus];

export const RoomType = {
  STANDARD: "STANDARD",
  DELUXE: "DELUXE",
  SUITE: "SUITE",
  PRESIDENTIAL: "PRESIDENTIAL",
} as const;

export type RoomType = (typeof RoomType)[keyof typeof RoomType];

export const AuditAction = {
  CREATE: "CREATE",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
  STATUS_CHANGE: "STATUS_CHANGE",
} as const;

export type AuditAction = (typeof AuditAction)[keyof typeof AuditAction];

export const RoomStatus = {
  AVAILABLE: "AVAILABLE",
  OCCUPIED: "OCCUPIED",
  MAINTENANCE: "MAINTENANCE",
  RESERVED: "RESERVED",
} as const;

export type RoomStatus = (typeof RoomStatus)[keyof typeof RoomStatus];

export const OrderStatus = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export const ServiceCategory = {
  SPA: "SPA",
  FITNESS: "FITNESS",
  DINING: "DINING",
  EXCURSION: "EXCURSION",
  TRANSFER: "TRANSFER",
  OTHER: "OTHER",
} as const;

export type ServiceCategory = (typeof ServiceCategory)[keyof typeof ServiceCategory];

export const RuleType = {
  SEASONAL: "SEASONAL",
  WEEKEND_SURGE: "WEEKEND_SURGE",
  LONG_STAY_DISCOUNT: "LONG_STAY_DISCOUNT",
  EARLY_BIRD: "EARLY_BIRD",
  LAST_MINUTE: "LAST_MINUTE",
} as const;

export type RuleType = (typeof RuleType)[keyof typeof RuleType];
