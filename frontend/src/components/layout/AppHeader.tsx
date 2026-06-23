import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { useUiStore } from "@/store/uiStore";
import { canAccessAdminAnalytics, isReceptionist } from "@/lib/roles";
import { logout as apiLogout } from "@/api/endpoints/auth.api";
import { Menu } from "lucide-react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

const siteLinkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium ${isActive ? "text-gold" : "text-cream/80 hover:text-gold"}`;

const accountLinkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium ${isActive ? "text-gold" : "text-cream/90 hover:text-gold"}`;

function NavDivider() {
  return <div className="mx-1 hidden h-7 w-px shrink-0 bg-cream/25 md:block" aria-hidden />;
}

export function AppHeader() {
  const { user, accessToken, logout } = useAuthStore();
  const location = useLocation();
  const isAdminArea = location.pathname.startsWith("/admin");
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const toggleMainNav = useUiStore((s) => s.toggleMainNav);
  const navigate = useNavigate();

  async function onLogout() {
    try {
      if (accessToken) await apiLogout();
    } catch {
      /* ignore */
    } finally {
      logout();
      navigate("/login");
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-navy/10 bg-navy text-cream shadow-md">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
        <button
          type="button"
          className="rounded-md p-2 text-cream hover:bg-white/10 md:hidden"
          onClick={() => (isAdminArea ? toggleSidebar() : toggleMainNav())}
          aria-label="Меню"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link to="/" className="font-display text-xl font-semibold text-gold">
          Luxury Resort
        </Link>
        <nav className="ml-auto hidden items-center gap-3 md:flex">
          <div className="flex items-center gap-5" aria-label="Каталог">
            <NavLink to="/rooms" className={siteLinkClass}>
              Номери
            </NavLink>
            <NavLink to="/services" className={siteLinkClass}>
              Послуги
            </NavLink>
            <NavLink to="/reviews" className={siteLinkClass}>
              Відгуки
            </NavLink>
          </div>
          {user && (
            <>
              <NavDivider />
              <div
                className="flex items-center gap-4 rounded-full border border-cream/15 bg-white/5 px-4 py-1.5"
                aria-label="Мій акаунт"
              >
                <span className="hidden text-[10px] font-semibold uppercase tracking-wider text-cream/45 lg:inline">
                  Мій акаунт
                </span>
                <NavLink to="/guest" end className={accountLinkClass}>
                  Кабінет
                </NavLink>
                <NavLink to="/guest/bookings" className={accountLinkClass}>
                  Мої бронювання
                </NavLink>
                <NavLink to="/guest/orders" className={accountLinkClass}>
                  Мої послуги
                </NavLink>
                <NavLink to="/guest/profile" className={accountLinkClass}>
                  Профіль
                </NavLink>
              </div>
              {(isReceptionist(user.role) || canAccessAdminAnalytics(user.role)) && (
                <>
                  <NavDivider />
                  <div className="flex items-center gap-4" aria-label="Персонал">
                    {isReceptionist(user.role) && (
                      <NavLink to="/staff/orders" className={siteLinkClass}>
                        Ресепшн
                      </NavLink>
                    )}
                    {canAccessAdminAnalytics(user.role) && (
                      <NavLink to="/admin/analytics" className={siteLinkClass}>
                        Адмін
                      </NavLink>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden text-xs text-cream/70 sm:inline">{user.email}</span>
              <Button variant="gold" size="sm" type="button" onClick={() => void onLogout()}>
                Вийти
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" className="text-cream" asChild>
                <Link to="/login">Увійти</Link>
              </Button>
              <Button variant="gold" size="sm" asChild>
                <Link to="/register">Реєстрація</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
