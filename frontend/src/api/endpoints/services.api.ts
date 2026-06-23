import { client, unwrap } from "@/api/http";
import type {
  ApiResponse,
  PageResponse,
  RecommendedServiceDto,
  ReviewResponse,
  ServiceOrderResponse,
  ServiceResponse,
} from "@/types/api";
import type { OrderStatus, ServiceCategory } from "@/types/domain";

export async function fetchServices(params: {
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
}): Promise<PageResponse<ServiceResponse>> {
  const res = await client.get<ApiResponse<PageResponse<ServiceResponse>>>("/services", {
    params: {
      page: params.page ?? 0,
      size: params.size ?? 20,
      sort: params.sort ?? "name,asc",
      q: params.q,
      category: params.category,
      available: params.available,
      priceMin: params.priceMin,
      priceMax: params.priceMax,
      durationMin: params.durationMin,
      durationMax: params.durationMax,
    },
  });
  return unwrap(res);
}

export async function fetchService(id: string): Promise<ServiceResponse> {
  const res = await client.get<ApiResponse<ServiceResponse>>(`/services/${id}`);
  return unwrap(res);
}

export async function fetchRecommendations(): Promise<RecommendedServiceDto[]> {
  const res = await client.get<ApiResponse<RecommendedServiceDto[]>>("/services/recommendations");
  return unwrap(res);
}

export async function fetchReviews(params: {
  roomId?: string;
  approved?: boolean;
  q?: string;
  ratingMin?: number;
  ratingMax?: number;
  from?: string;
  to?: string;
  sort?: string;
  page?: number;
  size?: number;
}): Promise<PageResponse<ReviewResponse>> {
  const res = await client.get<ApiResponse<PageResponse<ReviewResponse>>>("/reviews", {
    params: {
      roomId: params.roomId,
      approved: params.approved,
      q: params.q,
      ratingMin: params.ratingMin,
      ratingMax: params.ratingMax,
      from: params.from,
      to: params.to,
      page: params.page ?? 0,
      size: params.size ?? 20,
      sort: params.sort ?? "createdAt,desc",
    },
  });
  return unwrap(res);
}

export async function createReview(body: {
  bookingId: string;
  rating: number;
  comment?: string | null;
  images?: string[];
}): Promise<ReviewResponse> {
  const res = await client.post<ApiResponse<ReviewResponse>>("/reviews", body);
  return unwrap(res);
}

export async function fetchServiceOrders(params: {
  page?: number;
  size?: number;
  sort?: string;
  q?: string;
  status?: OrderStatus;
  from?: string;
  to?: string;
}): Promise<PageResponse<ServiceOrderResponse>> {
  const res = await client.get<ApiResponse<PageResponse<ServiceOrderResponse>>>("/service-orders", {
    params: {
      page: params.page ?? 0,
      size: params.size ?? 20,
      sort: params.sort ?? "createdAt,desc",
      q: params.q,
      status: params.status,
      from: params.from,
      to: params.to,
    },
  });
  return unwrap(res);
}

export async function approveReview(id: string): Promise<ReviewResponse> {
  const res = await client.put<ApiResponse<ReviewResponse>>(`/reviews/${id}/approve`);
  return unwrap(res);
}

export async function createServiceOrder(body: {
  serviceId: string;
  bookingId?: string | null;
  appointmentDatetime: string;
  quantity: number;
  specialRequests?: string | null;
}): Promise<ServiceOrderResponse> {
  const res = await client.post<ApiResponse<ServiceOrderResponse>>("/service-orders", body);
  return unwrap(res);
}

export type ServiceWriteBody = {
  name: string;
  description?: string | null;
  category: ServiceCategory;
  price: string;
  durationMinutes?: number | null;
  maxParticipants: number;
  images: string[];
  available: boolean;
};

export async function createService(body: ServiceWriteBody): Promise<ServiceResponse> {
  const res = await client.post<ApiResponse<ServiceResponse>>("/services", body);
  return unwrap(res);
}

export async function updateService(id: string, body: ServiceWriteBody): Promise<ServiceResponse> {
  const res = await client.put<ApiResponse<ServiceResponse>>(`/services/${id}`, body);
  return unwrap(res);
}

export async function deleteService(id: string): Promise<void> {
  await client.delete(`/services/${id}`);
}

export async function updateServiceOrderStatus(id: string, status: OrderStatus): Promise<ServiceOrderResponse> {
  const res = await client.put<ApiResponse<ServiceOrderResponse>>(`/service-orders/${id}/status`, { status });
  return unwrap(res);
}

export async function deleteReview(id: string): Promise<void> {
  await client.delete(`/reviews/${id}`);
}
