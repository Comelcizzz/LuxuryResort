import {
  fetchAdminUsers,
  fetchAuditLogs,
  fetchDashboard,
  fetchOccupancyForecast,
  fetchPricingRules,
  fetchRoomSentiment,
} from "@/api/endpoints/admin.api";
import type { AuditAction, RuleType, UserRole } from "@/types/domain";
import { useQuery } from "@tanstack/react-query";

export function useAdminDashboard() {
  return useQuery({ queryKey: ["admin", "dashboard"], queryFn: fetchDashboard });
}

export function useOccupancyForecast() {
  return useQuery({ queryKey: ["admin", "occupancy"], queryFn: fetchOccupancyForecast });
}

export function useRoomSentiment() {
  return useQuery({ queryKey: ["admin", "sentiment"], queryFn: fetchRoomSentiment });
}

export function usePricingRules(params: {
  page?: number;
  size?: number;
  sort?: string;
  q?: string;
  ruleType?: RuleType;
  active?: boolean;
}) {
  return useQuery({ queryKey: ["admin", "pricing", params], queryFn: () => fetchPricingRules(params) });
}

export function useAdminUsers(params: {
  page?: number;
  size?: number;
  sort?: string;
  q?: string;
  role?: UserRole;
  active?: boolean;
}) {
  return useQuery({
    queryKey: ["admin", "users", params],
    queryFn: () => fetchAdminUsers(params),
  });
}

export function useAuditLogs(params: {
  entityType?: string;
  action?: AuditAction;
  from?: string;
  to?: string;
  page?: number;
}) {
  return useQuery({
    queryKey: ["admin", "audit", params],
    queryFn: () => fetchAuditLogs(params),
  });
}
