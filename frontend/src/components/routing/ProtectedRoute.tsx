import { useAuthStore } from "@/store/authStore";
import type { PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";

export function ProtectedRoute({ children }: PropsWithChildren) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const location = useLocation();
  if (!accessToken) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return <>{children}</>;
}
