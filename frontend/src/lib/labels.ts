import type {
  AuditAction,
  BookingStatus,
  OrderStatus,
  RoomStatus,
  RoomType,
  RuleType,
  ServiceCategory,
  UserRole,
} from "@/types/domain";

const ROOM_TYPE_UK: Record<RoomType, string> = {
  STANDARD: "Стандарт",
  DELUXE: "Делюкс",
  SUITE: "Люкс",
  PRESIDENTIAL: "Президентський",
};

const SERVICE_CATEGORY_UK: Record<ServiceCategory, string> = {
  SPA: "СПА",
  FITNESS: "Фітнес",
  DINING: "Ресторан",
  EXCURSION: "Екскурсія",
  TRANSFER: "Трансфер",
  OTHER: "Інше",
};

const ORDER_STATUS_UK: Record<OrderStatus, string> = {
  PENDING: "Очікує",
  CONFIRMED: "Підтверджено",
  IN_PROGRESS: "Виконується",
  COMPLETED: "Завершено",
  CANCELLED: "Скасовано",
};

const BOOKING_STATUS_UK: Record<BookingStatus, string> = {
  PENDING: "Очікує",
  CONFIRMED: "Підтверджено",
  CHECKED_IN: "Заїзд",
  CHECKED_OUT: "Виїзд",
  CANCELLED: "Скасовано",
  NO_SHOW: "Не зʼявився",
};

const ROOM_STATUS_UK: Record<RoomStatus, string> = {
  AVAILABLE: "Доступний",
  OCCUPIED: "Зайнятий",
  MAINTENANCE: "На обслуговуванні",
  RESERVED: "Зарезервований",
};

const RULE_TYPE_UK: Record<RuleType, string> = {
  SEASONAL: "Сезонне",
  WEEKEND_SURGE: "Вихідні",
  LONG_STAY_DISCOUNT: "Довге перебування",
  EARLY_BIRD: "Раннє бронювання",
  LAST_MINUTE: "Остання хвилина",
};

const AUDIT_ACTION_UK: Record<AuditAction, string> = {
  CREATE: "Створення",
  UPDATE: "Оновлення",
  DELETE: "Видалення",
  STATUS_CHANGE: "Зміна статусу",
};

const USER_ROLE_UK: Record<UserRole, string> = {
  ADMIN: "Адміністратор",
  MANAGER: "Менеджер",
  RECEPTIONIST: "Ресепшн",
  GUEST: "Гість",
};

const ENTITY_TYPE_UK: Record<string, string> = {
  ROOM: "Номер",
  BOOKING: "Бронювання",
  SERVICE: "Послуга",
  SERVICE_ORDER: "Замовлення послуги",
  USER: "Користувач",
  PRICING_RULE: "Правило ціноутворення",
  REVIEW: "Відгук",
};

const PRICING_RULE_NAME_UK: Record<string, string> = {
  "Summer Weekend Surge": "Літній підвищений тариф на вихідні",
  "Seven Night Loyalty Stay": "Знижка за перебування 7+ ночей",
  "Early Bird Thirty Days": "Раннє бронювання (30 днів)",
  "Last Minute Premium Demand": "Підвищений тариф останньої хвилини",
};

export const AUDIT_ENTITY_TYPES = [
  "ROOM",
  "BOOKING",
  "SERVICE",
  "SERVICE_ORDER",
  "USER",
  "PRICING_RULE",
  "REVIEW",
] as const;

export function roomTypeLabelUk(type: RoomType): string {
  return ROOM_TYPE_UK[type] ?? type;
}

export function serviceCategoryLabelUk(category: ServiceCategory): string {
  return SERVICE_CATEGORY_UK[category] ?? category;
}

export function orderStatusLabelUk(status: OrderStatus): string {
  return ORDER_STATUS_UK[status] ?? status;
}

export function bookingStatusLabelUk(status: BookingStatus): string {
  return BOOKING_STATUS_UK[status] ?? status;
}

export function roomStatusLabelUk(status: RoomStatus): string {
  return ROOM_STATUS_UK[status] ?? status;
}

export function ruleTypeLabelUk(type: RuleType): string {
  return RULE_TYPE_UK[type] ?? type;
}

export function auditActionLabelUk(action: AuditAction): string {
  return AUDIT_ACTION_UK[action] ?? action;
}

export function userRoleLabelUk(role: UserRole): string {
  return USER_ROLE_UK[role] ?? role;
}

export function entityTypeLabelUk(entityType: string): string {
  return ENTITY_TYPE_UK[entityType] ?? entityType;
}

export function pricingRuleNameLabelUk(name: string): string {
  return PRICING_RULE_NAME_UK[name] ?? name;
}
