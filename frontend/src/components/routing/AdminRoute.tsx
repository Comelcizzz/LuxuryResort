import { canAccessAdminAnalytics } from "@/lib/roles";
import { useAuthStore } from "@/store/authStore";
import type { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";

export function AdminRoute({ children }: PropsWithChildren) {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.accessToken);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (!user || !canAccessAdminAnalytics(user.role)) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}
