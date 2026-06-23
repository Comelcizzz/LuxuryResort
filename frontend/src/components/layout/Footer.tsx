import { Link } from "react-router-dom";
import { resortContact } from "@/lib/contact";

const footLink = "text-cream/80 hover:text-gold";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-navy/10 bg-navy py-10 text-cream">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div>
            <p className="font-display text-lg text-gold">Luxury Resort</p>
            <p className="mt-2 text-sm text-cream/70">Дипломний проєкт · Spring Boot + React</p>
          </div>
          <div className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm sm:grid-cols-4">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-cream/50">Каталог</span>
              <Link className={footLink} to="/rooms">
                Номери
              </Link>
              <Link className={footLink} to="/services">
                Послуги
              </Link>
              <Link className={footLink} to="/reviews">
                Відгуки
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-cream/50">Акаунт</span>
              <Link className={footLink} to="/login">
                Увійти
              </Link>
              <Link className={footLink} to="/register">
                Реєстрація
              </Link>
              <Link className={footLink} to="/guest">
                Кабінет гостя
              </Link>
            </div>
            <div className="col-span-2 flex flex-col gap-2 sm:col-span-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-cream/50">Бронювання</span>
              <a className={footLink} href={resortContact.phoneHref}>
                {resortContact.phoneDisplay}
              </a>
              <a className={footLink} href={resortContact.bookingEmailHref}>
                {resortContact.bookingEmail}
              </a>
            </div>
            <div className="col-span-2 flex flex-col gap-2 sm:col-span-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-cream/50">Юридичне</span>
              <p className="text-cream/60">Демо-дані; без реальних платежів у тестовому режимі.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
