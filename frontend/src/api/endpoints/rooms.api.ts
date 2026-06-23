import { client, unwrap } from "@/api/http";
import type {
  ApiResponse,
  PageResponse,
  RoomAvailabilityResponse,
  RoomResponse,
} from "@/types/api";
import type { RoomStatus, RoomType } from "@/types/domain";

export async function fetchRooms(params: {
  page?: number;
  size?: number;
  q?: string;
  sort?: string;
  type?: RoomType;
  priceMin?: string;
  priceMax?: string;
  maxOccupancy?: number;
  available?: boolean;
}): Promise<PageResponse<RoomResponse>> {
  const res = await client.get<ApiResponse<PageResponse<RoomResponse>>>("/rooms", { params });
  return unwrap(res);
}

export async function fetchRoom(id: string): Promise<RoomResponse> {
  const res = await client.get<ApiResponse<RoomResponse>>(`/rooms/${id}`);
  return unwrap(res);
}

export async function fetchAvailability(
  roomId: string,
  checkIn: string,
  checkOut: string
): Promise<RoomAvailabilityResponse> {
  const res = await client.get<ApiResponse<RoomAvailabilityResponse>>(
    `/rooms/${roomId}/availability`,
    { params: { checkIn, checkOut } }
  );
  return unwrap(res);
}

export type RoomWriteBody = {
  name: string;
  description?: string | null;
  basePricePerNight: string;
  roomType: RoomType;
  maxOccupancy: number;
  sizeSqm?: string | null;
  floor?: number | null;
  roomNumber: string;
  status: RoomStatus;
  amenities: string[];
  images: string[];
};

export async function createRoom(body: RoomWriteBody): Promise<RoomResponse> {
  const res = await client.post<ApiResponse<RoomResponse>>("/rooms", body);
  return unwrap(res);
}

export async function updateRoom(id: string, body: RoomWriteBody): Promise<RoomResponse> {
  const res = await client.put<ApiResponse<RoomResponse>>(`/rooms/${id}`, body);
  return unwrap(res);
}

export async function deleteRoom(id: string): Promise<void> {
  await client.delete(`/rooms/${id}`);
}
