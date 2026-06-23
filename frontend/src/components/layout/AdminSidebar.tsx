import { useUiStore } from "@/store/uiStore";
import { useAuthStore } from "@/store/authStore";
import {
  canAccessAdminAnalytics,
  canApproveReviews,
  canChangeRoles,
  canManageUsers,
  canUpdateServiceOrderStatus,
  canViewAudit,
} from "@/lib/roles";
import {
  BarChart3,
  ClipboardList,
  ConciergeBell,
  DoorOpen,
  Home,
  LineChart,
  MessageSquareWarning,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const item =
  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-cream/80 hover:bg-white/10 hover:text-gold";

export function AdminSidebar() {
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);
  const role = useAuthStore((s) => s.user?.role);

  if (!canAccessAdminAnalytics(role)) {
    return null;
  }

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 w-56 border-r border-navy/20 bg-navy pt-20 text-cream transition-transform md:static md:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <nav className="flex flex-col gap-1 p-3">
        <NavLink to="/admin/analytics" className={({ isActive }) => cn(item, isActive && "bg-white/10 text-gold")}>
          <BarChart3 className="h-4 w-4" /> Аналітика
        </NavLink>
        <NavLink to="/admin/rooms" className={({ isActive }) => cn(item, isActive && "bg-white/10 text-gold")}>
          <DoorOpen className="h-4 w-4" /> Номери
        </NavLink>
        <NavLink to="/admin/services" className={({ isActive }) => cn(item, isActive && "bg-white/10 text-gold")}>
          <Sparkles className="h-4 w-4" /> Послуги
        </NavLink>
        {canUpdateServiceOrderStatus(role) && (
          <NavLink
            to="/admin/service-orders"
            className={({ isActive }) => cn(item, isActive && "bg-white/10 text-gold")}
          >
            <ConciergeBell className="h-4 w-4" /> Замовлення
          </NavLink>
        )}
        {canApproveReviews(role) && (
          <NavLink to="/admin/reviews" className={({ isActive }) => cn(item, isActive && "bg-white/10 text-gold")}>
            <MessageSquareWarning className="h-4 w-4" /> Відгуки
          </NavLink>
        )}
        <NavLink to="/admin/pricing" className={({ isActive }) => cn(item, isActive && "bg-white/10 text-gold")}>
          <LineChart className="h-4 w-4" /> Ціни
        </NavLink>
        {canManageUsers(role) && (
          <NavLink to="/admin/users" className={({ isActive }) => cn(item, isActive && "bg-white/10 text-gold")}>
            <Users className="h-4 w-4" /> Користувачі
          </NavLink>
        )}
        {canViewAudit(role) && (
          <NavLink to="/admin/audit" className={({ isActive }) => cn(item, isActive && "bg-white/10 text-gold")}>
            <ClipboardList className="h-4 w-4" /> Аудит
          </NavLink>
        )}
        <NavLink to="/" className={cn(item, "mt-6 border-t border-white/10 pt-4")}>
          <Home className="h-4 w-4" /> На сайт
        </NavLink>
        {!canChangeRoles(role) && (
          <p className="mt-4 flex items-start gap-2 px-3 text-xs text-cream/50">
            <Shield className="mt-0.5 h-3 w-3 shrink-0" />
            Зміна ролей та аудит — лише адміністратор
          </p>
        )}
      </nav>
    </aside>
  );
}
