import { useUiStore } from "@/store/uiStore";
import { useAuthStore } from "@/store/authStore";
import { canAccessAdminAnalytics, isReceptionist } from "@/lib/roles";
import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "block rounded-lg px-3 py-2.5 text-sm font-medium",
    isActive ? "bg-white/10 text-gold" : "text-cream/85 hover:bg-white/10 hover:text-gold"
  );

function NavSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mt-3 first:mt-0">
      <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-wider text-cream/45">{title}</p>
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  );
}

export function MobileMainNav() {
  const location = useLocation();
  const open = useUiStore((s) => s.mainNavOpen);
  const setOpen = useUiStore((s) => s.setMainNavOpen);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, setOpen]);

  useEffect(() => {
    return () => setOpen(false);
  }, [setOpen]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Меню сайту">
      <button
        type="button"
        className="absolute inset-0 bg-black/45"
        aria-label="Закрити меню"
        onClick={() => setOpen(false)}
      />
      <nav className="absolute left-0 top-0 flex h-full w-[min(20rem,88vw)] flex-col border-r border-white/10 bg-navy py-4 shadow-xl">
        <div className="flex items-center justify-between px-3 pb-2">
          <span className="font-display text-lg text-gold">Меню</span>
          <button
            type="button"
            className="rounded-md p-2 text-cream hover:bg-white/10"
            aria-label="Закрити"
            onClick={() => setOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex flex-1 flex-col overflow-y-auto px-2 pt-2">
          <NavSection title="Сайт">
            <NavLink to="/" end className={linkClass} onClick={() => setOpen(false)}>
              Головна
            </NavLink>
            <NavLink to="/rooms" className={linkClass} onClick={() => setOpen(false)}>
              Номери
            </NavLink>
            <NavLink to="/services" className={linkClass} onClick={() => setOpen(false)}>
              Послуги
            </NavLink>
            <NavLink to="/reviews" className={linkClass} onClick={() => setOpen(false)}>
              Відгуки
            </NavLink>
          </NavSection>
          {user ? (
            <>
              <NavSection title="Мій акаунт">
                <NavLink to="/guest" end className={linkClass} onClick={() => setOpen(false)}>
                  Кабінет
                </NavLink>
                <NavLink to="/guest/bookings" className={linkClass} onClick={() => setOpen(false)}>
                  Мої бронювання
                </NavLink>
                <NavLink to="/guest/orders" className={linkClass} onClick={() => setOpen(false)}>
                  Мої послуги
                </NavLink>
                <NavLink to="/guest/profile" className={linkClass} onClick={() => setOpen(false)}>
                  Профіль
                </NavLink>
              </NavSection>
              {(isReceptionist(user.role) || canAccessAdminAnalytics(user.role)) && (
                <NavSection title="Персонал">
                  {isReceptionist(user.role) && (
                    <NavLink to="/staff/orders" className={linkClass} onClick={() => setOpen(false)}>
                      Ресепшн
                    </NavLink>
                  )}
                  {canAccessAdminAnalytics(user.role) && (
                    <NavLink to="/admin/analytics" className={linkClass} onClick={() => setOpen(false)}>
                      Адмін-панель
                    </NavLink>
                  )}
                </NavSection>
              )}
            </>
          ) : (
            <NavSection title="Вхід">
              <NavLink to="/login" className={linkClass} onClick={() => setOpen(false)}>
                Увійти
              </NavLink>
              <NavLink to="/register" className={linkClass} onClick={() => setOpen(false)}>
                Реєстрація
              </NavLink>
            </NavSection>
          )}
        </div>
      </nav>
    </div>
  );
}
