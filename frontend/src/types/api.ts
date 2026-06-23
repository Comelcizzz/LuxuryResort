import type { AuditAction, BookingStatus, RoomType, UserRole } from "./domain";

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string | null;
  errors: Record<string, string> | null;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface UserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  role: UserRole;
  active: boolean;
  loyaltyPoints: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserResponse;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface AppliedRuleDto {
  name: string;
  multiplier: string;
}

export interface PricingResult {
  baseTotal: string;
  finalTotal: string;
  combinedMultiplier: string;
  loyaltyDiscount: string;
  appliedRules: AppliedRuleDto[];
  pointsEarned: number;
}

export interface RoomResponse {
  id: string;
  name: string;
  description: string | null;
  basePricePerNight: string;
  roomType: RoomType;
  maxOccupancy: number;
  sizeSqm: string | null;
  floor: number | null;
  roomNumber: string;
  status: string;
  amenities: string[];
  images: string[];
  avgRating: string;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface RoomAvailabilityResponse {
  available: boolean;
}

export interface BookingResponse {
  id: string;
  roomId: string;
  roomNumber: string;
  roomName: string;
  userId: string;
  userEmail: string;
  checkInDate: string;
  checkOutDate: string;
  guestsCount: number;
  baseTotal: string;
  dynamicPriceTotal: string;
  finalMultiplier: string;
  status: BookingStatus;
  cancellationReason: string | null;
  specialRequests: string | null;
  loyaltyPointsEarned: number;
  loyaltyPointsUsed: number;
  createdAt: string;
  updatedAt: string;
  pricing: PricingResult | null;
}

export interface PayBookingResponse {
  bookingStatus: BookingStatus;
  payment: {
    id: string;
    bookingId: string;
    amount: string;
    currency: string;
    status: string;
    paymentMethod: string | null;
    transactionRef: string | null;
    failureReason: string | null;
    processedAt: string | null;
    createdAt: string;
  };
}

export interface ServiceResponse {
  id: string;
  name: string;
  description: string | null;
  category: string;
  price: string;
  durationMinutes: number | null;
  maxParticipants: number;
  images: string[];
  available: boolean;
  popularityScore: string;
  createdAt: string;
  deletedAt: string | null;
}

export interface RecommendedServiceDto {
  id: string;
  name: string;
  category: string;
  price: string;
  relevanceScore: string;
}

export interface ServiceOrderResponse {
  id: string;
  serviceId: string;
  serviceName: string;
  userId: string;
  bookingId: string | null;
  appointmentDatetime: string;
  quantity: number;
  totalPrice: string;
  status: string;
  specialRequests: string | null;
  createdAt: string;
}

export interface ReviewResponse {
  id: string;
  roomId: string;
  userId: string;
  authorName: string;
  bookingId: string;
  rating: number;
  comment: string | null;
  images: string[];
  sentimentScore: string | null;
  approved: boolean;
  createdAt: string;
}

export interface AdminDashboardResponse {
  totalRevenue: string;
  occupancyRate: string;
  bookingsByStatus: Partial<Record<BookingStatus, number>>;
  topRooms: { roomId: string; roomName: string; revenue: string }[];
  revenueByMonth: { year: number; month: number; revenue: string }[];
}

export interface OccupancyForecastDto {
  date: string;
  predictedOccupancyRate: string;
}

export interface OccupancyTrendResponse {
  history: OccupancyForecastDto[];
  scheduled: OccupancyForecastDto[];
}

export interface RoomSentimentDto {
  roomId: string;
  roomName: string;
  averageSentiment: string;
}

export interface PricingRuleResponse {
  id: string;
  name: string;
  ruleType: string;
  multiplier: string;
  startDate: string | null;
  endDate: string | null;
  minNights: number | null;
  daysBeforeCheckin: number | null;
  priority: number;
  active: boolean;
  createdAt: string;
}

export interface AuditLogResponse {
  id: string;
  entityType: string;
  entityId: string;
  action: AuditAction;
  oldValue: Record<string, unknown> | null;
  newValue: Record<string, unknown> | null;
  performedByUserId: string | null;
  performedByEmail: string | null;
  ipAddress: string | null;
  createdAt: string;
}
