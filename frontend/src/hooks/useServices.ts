import { fetchReviews, fetchService, fetchServiceOrders, fetchServices } from "@/api/endpoints/services.api";
import type { OrderStatus, ServiceCategory } from "@/types/domain";
import { useQuery } from "@tanstack/react-query";

export function useServices(params: {
  page?: number;
  size?: number;
  sort?: string;
  q?: string;
  category?: ServiceCategory;
  available?: boolean;
  priceMin?: string;
  priceMax?: string;
  durationMin?: number;
  durationMax?: number;
}) {
  return useQuery({
    queryKey: ["services", params],
    queryFn: () => fetchServices(params),
  });
}

export function useService(id: string | undefined) {
  return useQuery({
    queryKey: ["service", id],
    queryFn: () => fetchService(id!),
    enabled: Boolean(id),
  });
}

export function useServiceOrders(params: {
  page?: number;
  size?: number;
  sort?: string;
  q?: string;
  status?: OrderStatus;
  from?: string;
  to?: string;
}) {
  return useQuery({
    queryKey: ["service-orders", params],
    queryFn: () => fetchServiceOrders(params),
  });
}

export function useReviews(roomId?: string, approved = true, page = 0) {
  return useQuery({
    queryKey: ["reviews", roomId, approved, page],
    queryFn: () => fetchReviews({ roomId, approved, page }),
  });
}
