# Промпт для наступного чату (продовження LuxuryResort)

Скопіюй блок нижче в **новий** чат у цьому ж проєкті (`Дипломна Киця`), щоб агент мав контекст без довгої історії.

---

**Контекст:** Курсова MERN (LuxuryResort) перенесена в **`legacy/backend/`** (Express + MongoDB) та **`legacy/frontend/`** (React + Vite). Дипломний backend — **`backend/`** (Spring Boot + PostgreSQL за `promt.md`); дипломний фронт — **`frontend/`** (Vite + React + TS, F19–F21 у `docs/luxuryresort/ROADMAP.md`). ТЗ: `promt.md`. Трекінг: `docs/luxuryresort/ROADMAP.md`, `docs/luxuryresort/features/F*.md`.

**Що вже зроблено (MERN, не дипломний Spring):**

1. **Бронювання + мок-оплата:** `POST /api/bookings/:id/mock-pay` (затримка ~800 ms, ~90% успіх), поля в `Booking`: `isPaid`, `paymentMethod`, `paymentRef`, `paidAt`, статус `completed` у enum. Відповіді бронювань нормалізовані: `guest` = `client`, `nights`, `pricePerNight`, `isPaid`.
2. **Сторінка мок-еквайрингу:** `legacy/frontend/src/pages/MockPayment.jsx`, маршрут `/bookings/:id/mock-pay` (PrivateRoute) у `App.jsx`. Кнопка з `Bookings.jsx`.
3. **Сид БД:** `legacy/backend/scripts/seed.js` — кімнати `LR-2xx`, послуги, **відгуки з масивом `images` (URL Unsplash)**; демо-користувачі `luxresseed0@gmail.com` … `luxresseed9@gmail.com`, пароль `Passw0rd!`. Команди: `cd legacy/backend && npm run seed` / `npm run seed:reset` (**reset** видаляє демо-клієнтів seed, броні/відгуки їх, усі `LR-*` кімнати, **усі** послуги — не на проді).
4. **Моделі:** `Service.images[]`, `Review.images[]` (посилання на фото). `reviewController` приймає `images` у POST/PUT.
5. **UI:** `RoomDetails` — галерея без дублікатів, фото у відгуках. `ServiceDetails` — галерея з `images` + `image`/`url`.

**Швидкий старт дипломного API:** `npm run db:up` (Postgres з кореневого `docker-compose.yml`), у `backend/.env` — `resort_user` / `resort_pass`, потім `mvnw spring-boot:run`. **Фронт диплому:** `npm run dev:diploma-frontend` (Vite у `frontend/`, проксі `/api` → `localhost:8080`; Spring з `--spring.profiles.active=dev` для CORS). Повний стек у Docker: `npm run docker:app` (потрібен `.env` з `JWT_SECRET`). Деталі: [README.md](../../README.md), [docs/DEPLOY_DEV.md](../../docs/DEPLOY_DEV.md).

**Що логічно зробити далі:** [F22](features/F22-frontend-tests.md) — Vitest + RTL; за потреби — глибше логування в `audit_logs` з бізнес-сервісів; доробити «Partial» з ROADMAP (наприклад, анімації F21), мобільна навігація / пагінація довгих списків у SPA — за пріоритетом.

**Оновлення (Spring + `frontend/`):** F11 — оплата; каталог номерів/послуг, бронювання, замовлення послуг, відгуки + модерація, адмін-аналітика, loyalty, PDF-інвойс, pricing/users/audit — у `backend/.../web/controller/`; RBAC узгоджено з `SecurityConfig`. SPA: публічні `/`, `/rooms`, `/services`, `/reviews`; гість `/guest/*`, бронювання `/rooms/:id/book`; `/admin/*` (MANAGER/ADMIN); ресепшн `/staff/orders` (RECEPTIONIST); `App.tsx`. Діаграми та таблиця API: `docs/diagrams/*`, [DIPLOMA_ZAPYSKA_HELPER.md](DIPLOMA_ZAPYSKA_HELPER.md), F23.

**Файли для швидкого пошуку (курсова):** `legacy/backend/controllers/bookingController.js`, `legacy/backend/routes/bookings.js`, `legacy/backend/scripts/seed.js`, `legacy/frontend/src/pages/MockPayment.jsx`, `legacy/frontend/src/pages/Bookings.jsx`.

---

Після вставки додай своє запитання одним реченням (наприклад: «Підключи форму додавання кількох фото до відгуку» або «Почни F22 тести для Login»).
