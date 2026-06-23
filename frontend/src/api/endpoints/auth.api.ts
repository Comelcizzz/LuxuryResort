import { client, unwrap } from "@/api/http";
import type { ApiResponse, AuthResponse, UserResponse } from "@/types/api";

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await client.post<ApiResponse<AuthResponse>>("/auth/login", { email, password });
  return unwrap(res);
}

export async function register(body: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
}): Promise<AuthResponse> {
  const res = await client.post<ApiResponse<AuthResponse>>("/auth/register", body);
  return unwrap(res);
}

export async function fetchMe(): Promise<UserResponse> {
  const res = await client.get<ApiResponse<UserResponse>>("/auth/me");
  return unwrap(res);
}

export async function logout(): Promise<void> {
  await client.post("/auth/logout");
}

export async function updateProfile(body: {
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
}): Promise<UserResponse> {
  const res = await client.put<ApiResponse<UserResponse>>("/auth/me", body);
  return unwrap(res);
}
