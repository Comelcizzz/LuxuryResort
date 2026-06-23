import { isReceptionist } from "@/lib/roles";
import { useAuthStore } from "@/store/authStore";
import type { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";

export function StaffRoute({ children }: PropsWithChildren) {
  const token = useAuthStore((s) => s.accessToken);
  const role = useAuthStore((s) => s.user?.role);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (!isReceptionist(role)) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}
