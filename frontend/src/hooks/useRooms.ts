import { fetchRoom, fetchRooms } from "@/api/endpoints/rooms.api";
import type { RoomType } from "@/types/domain";
import { useQuery } from "@tanstack/react-query";

export function useRooms(params: {
  page?: number;
  size?: number;
  q?: string;
  sort?: string;
  type?: RoomType;
  priceMin?: string;
  priceMax?: string;
  maxOccupancy?: number;
  available?: boolean;
}) {
  return useQuery({
    queryKey: ["rooms", params],
    queryFn: () =>
      fetchRooms({
        page: params.page ?? 0,
        size: params.size,
        q: params.q,
        sort: params.sort,
        type: params.type,
        priceMin: params.priceMin,
        priceMax: params.priceMax,
        maxOccupancy: params.maxOccupancy,
        available: params.available,
      }),
  });
}

export function useRoom(id: string | undefined) {
  return useQuery({
    queryKey: ["room", id],
    queryFn: () => fetchRoom(id!),
    enabled: Boolean(id),
  });
}
