import type { ApiResponse } from "@/types/api";
import { translateApiMessage } from "@/lib/apiMessages";
import { useAuthStore } from "@/store/authStore";
import axios, { type AxiosError, type AxiosResponse } from "axios";

const baseURL = import.meta.env.VITE_API_BASE ?? "/api";

export const rawClient = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

export function unwrap<T>(res: AxiosResponse<ApiResponse<T>>): T {
  const body = res.data;
  if (!body.success || body.data === null) {
    const msg = translateApiMessage(body.message) ?? "Помилка API";
    throw new Error(msg);
  }
  return body.data;
}

let isRefreshing = false;

type QueueItem = {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
};

let failedQueue: QueueItem[] = [];

function processQueue(error: unknown, token: string | null): void {
  failedQueue.forEach((p) => {
    if (error) {
      p.reject(error);
    } else if (token) {
      p.resolve(token);
    }
  });
  failedQueue = [];
}

export const client = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

client.interceptors.request.use((config) => {
  const access = useAuthStore.getState().accessToken;
  if (access) {
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});

client.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    if (!originalRequest) {
      return Promise.reject(error);
    }
    const status = error.response?.status;
    const url = originalRequest.url ?? "";
    const isAuthPath =
      url.includes("/auth/refresh") ||
      url.includes("/auth/login") ||
      url.includes("/auth/register");

    if (status === 401 && !originalRequest._retry && !isAuthPath) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return client(originalRequest);
          })
          .catch((err: unknown) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;
      const storedRefresh = useAuthStore.getState().refreshToken;
      if (!storedRefresh) {
        isRefreshing = false;
        useAuthStore.getState().logout();
        window.location.href = "/login";
        return Promise.reject(error);
      }
      try {
        const res = await rawClient.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
          "/auth/refresh",
          { refreshToken: storedRefresh }
        );
        const data = unwrap(res);
        useAuthStore.getState().setTokensFromRefresh(data.accessToken, data.refreshToken);
        processQueue(null, data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return client(originalRequest);
      } catch (err) {
        processQueue(err, null);
        useAuthStore.getState().logout();
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    const serverMsg = (error.response?.data as { message?: string } | undefined)?.message;
    const translated = translateApiMessage(serverMsg);
    return Promise.reject(translated != null ? new Error(translated) : error);
  }
);
