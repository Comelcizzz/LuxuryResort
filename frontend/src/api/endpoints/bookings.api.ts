import { client, unwrap } from "@/api/http";
import type {
  ApiResponse,
  BookingResponse,
  PageResponse,
  PayBookingResponse,
} from "@/types/api";
import type { BookingStatus } from "@/types/domain";

export async function fetchBookings(params: {
  page?: number;
  size?: number;
  sort?: string;
  q?: string;
  status?: BookingStatus;
  from?: string;
  to?: string;
  checkInFrom?: string;
  checkInTo?: string;
}): Promise<PageResponse<BookingResponse>> {
  const res = await client.get<ApiResponse<PageResponse<BookingResponse>>>("/bookings", {
    params: {
      page: params.page ?? 0,
      size: params.size ?? 20,
      sort: params.sort ?? "createdAt,desc",
      q: params.q,
      status: params.status,
      from: params.from,
      to: params.to,
      checkInFrom: params.checkInFrom,
      checkInTo: params.checkInTo,
    },
  });
  return unwrap(res);
}

export async function fetchBooking(id: string): Promise<BookingResponse> {
  const res = await client.get<ApiResponse<BookingResponse>>(`/bookings/${id}`);
  return unwrap(res);
}

export async function createBooking(body: {
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  loyaltyPointsToUse: number;
  specialRequests?: string | null;
}): Promise<BookingResponse> {
  const res = await client.post<ApiResponse<BookingResponse>>("/bookings", {
    roomId: body.roomId,
    checkIn: body.checkIn,
    checkOut: body.checkOut,
    guests: body.guests,
    loyaltyPointsToUse: body.loyaltyPointsToUse,
    specialRequests: body.specialRequests ?? null,
  });
  return unwrap(res);
}

export async function payBooking(id: string, paymentMethod: string): Promise<PayBookingResponse> {
  const res = await client.post<ApiResponse<PayBookingResponse>>(`/bookings/${id}/pay`, {
    paymentMethod,
  });
  return unwrap(res);
}

export async function updateBookingStatus(
  id: string,
  status: BookingStatus,
  reason?: string | null
): Promise<BookingResponse> {
  const res = await client.put<ApiResponse<BookingResponse>>(`/bookings/${id}/status`, {
    status,
    reason: reason ?? null,
  });
  return unwrap(res);
}

export async function downloadInvoice(id: string): Promise<Blob> {
  const res = await client.get<Blob>(`/bookings/${id}/invoice`, { responseType: "blob" });
  return res.data;
}
