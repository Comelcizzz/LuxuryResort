import { client, unwrap } from "@/api/http";
import type {
  AdminDashboardResponse,
  ApiResponse,
  AuditLogResponse,
  OccupancyTrendResponse,
  PageResponse,
  PricingRuleResponse,
  RoomSentimentDto,
  UserResponse,
} from "@/types/api";
import type { AuditAction, RuleType, UserRole } from "@/types/domain";

export async function fetchDashboard(): Promise<AdminDashboardResponse> {
  const res = await client.get<ApiResponse<AdminDashboardResponse>>("/admin/analytics/dashboard");
  return unwrap(res);
}

export async function fetchOccupancyForecast(): Promise<OccupancyTrendResponse> {
  const res = await client.get<ApiResponse<OccupancyTrendResponse>>(
    "/admin/analytics/occupancy-forecast"
  );
  return unwrap(res);
}

export async function fetchRoomSentiment(): Promise<RoomSentimentDto[]> {
  const res = await client.get<ApiResponse<RoomSentimentDto[]>>("/admin/analytics/room-sentiment");
  return unwrap(res);
}

export async function fetchPricingRules(params: {
  page?: number;
  size?: number;
  sort?: string;
  q?: string;
  ruleType?: RuleType;
  active?: boolean;
}): Promise<PageResponse<PricingRuleResponse>> {
  const res = await client.get<ApiResponse<PageResponse<PricingRuleResponse>>>("/admin/pricing-rules", {
    params: {
      page: params.page ?? 0,
      size: params.size ?? 20,
      sort: params.sort ?? "priority,desc",
      q: params.q,
      ruleType: params.ruleType,
      active: params.active,
    },
  });
  return unwrap(res);
}

export async function updatePricingRule(
  id: string,
  body: Record<string, unknown>
): Promise<PricingRuleResponse> {
  const res = await client.put<ApiResponse<PricingRuleResponse>>(`/admin/pricing-rules/${id}`, body);
  return unwrap(res);
}

export async function createPricingRule(body: Record<string, unknown>): Promise<PricingRuleResponse> {
  const res = await client.post<ApiResponse<PricingRuleResponse>>("/admin/pricing-rules", body);
  return unwrap(res);
}

export async function fetchAdminUsers(params: {
  page?: number;
  size?: number;
  sort?: string;
  q?: string;
  role?: UserRole;
  active?: boolean;
}): Promise<PageResponse<UserResponse>> {
  const res = await client.get<ApiResponse<PageResponse<UserResponse>>>("/admin/users", {
    params: {
      page: params.page ?? 0,
      size: params.size ?? 20,
      sort: params.sort ?? "createdAt,desc",
      q: params.q,
      role: params.role,
      active: params.active,
    },
  });
  return unwrap(res);
}

export async function updateUserRole(userId: string, role: UserRole): Promise<UserResponse> {
  const res = await client.put<ApiResponse<UserResponse>>(`/admin/users/${userId}/role`, { role });
  return unwrap(res);
}

export async function fetchAuditLogs(params: {
  entityType?: string;
  action?: AuditAction;
  from?: string;
  to?: string;
  page?: number;
  size?: number;
}): Promise<PageResponse<AuditLogResponse>> {
  const res = await client.get<ApiResponse<PageResponse<AuditLogResponse>>>("/admin/audit-logs", {
    params: {
      entityType: params.entityType,
      action: params.action,
      from: params.from,
      to: params.to,
      page: params.page ?? 0,
      size: params.size ?? 50,
      sort: "createdAt,desc",
    },
  });
  return unwrap(res);
}
