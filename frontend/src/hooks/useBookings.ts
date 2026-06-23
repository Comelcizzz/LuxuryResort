import { fetchBooking, fetchBookings } from "@/api/endpoints/bookings.api";
import { useQuery } from "@tanstack/react-query";

export function useBookings(page = 0) {
  return useQuery({
    queryKey: ["bookings", page],
    queryFn: () => fetchBookings({ page }),
  });
}

export function useBooking(id: string | undefined) {
  return useQuery({
    queryKey: ["booking", id],
    queryFn: () => fetchBooking(id!),
    enabled: Boolean(id),
  });
}
