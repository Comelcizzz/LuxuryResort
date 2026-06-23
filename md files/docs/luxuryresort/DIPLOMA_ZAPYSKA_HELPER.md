# Матеріали для пояснювальної записки та звіту (Luxury Resort)

Документ зводить **артефакти**, **REST-ендпоінти** і **діаграми**, щоб швидше заповнити розділи записки: предметна область, проєктування, реалізація, тестування, безпека, висновки.

## 1. Діаграми (готові до вставки в PDF)

Усі файли у форматі **Mermaid** (рендер у GitHub, Cursor, VS Code + плагін):

| Файл | Зміст | Типовий розділ записки |
|------|--------|-------------------------|
| [docs/diagrams/use-case.md](../diagrams/use-case.md) | Актори та прецеденти | Аналіз предметної області |
| [docs/diagrams/erd.md](../diagrams/erd.md) | ER-модель (11 таблиць + refresh_tokens) | Проєктування БД |
| [docs/diagrams/class-diagram.md](../diagrams/class-diagram.md) | Шари сервісів / контролерів | Архітектура ПЗ |
| [docs/diagrams/sequence-booking.md](../diagrams/sequence-booking.md) | Бронювання → ціна → оплата | Сценарії взаємодії |
| [docs/diagrams/sequence-auth.md](../diagrams/sequence-auth.md) | JWT + refresh | Підсистема безпеки |
| [docs/diagrams/component.md](../diagrams/component.md) | SPA ↔ API ↔ PostgreSQL | Розгортання / компоненти |

**Експорт у зображення:** Mermaid Live Editor, `mmdc` (mermaid-cli), або Pandoc з `--filter mermaid-filter`.

## 2. Короткий аудит модулів backend

| Модуль | Призначення | Ключові класи |
|--------|-------------|---------------|
| Auth | Реєстрація, логін, JWT, refresh | `AuthController`, `AuthServiceImpl`, `JwtAuthFilter` |
| Rooms | Каталог номерів, CRUD, доступність | `RoomController`, `RoomServiceImpl` |
| Bookings | Бронювання, статуси, скасування гостем | `BookingController`, `BookingServiceImpl` |
| Pricing | Динамічна ціна + snapshot | `DynamicPricingServiceImpl` |
| Payments | Mock-оплата | `PaymentServiceImpl` |
| Services | Каталог послуг, рекомендації | `ServiceCatalogController`, `ResortCatalogServiceImpl` |
| Service orders | Замовлення послуг, статуси персоналу | `ServiceOrderController`, `ServiceOrderServiceImpl` |
| Reviews | Відгуки, sentiment (лексикон), модерація | `ReviewController`, `ReviewServiceImpl`, `SentimentAnalysis` |
| Loyalty | Баланс і еквівалент знижки (cap 15%) | `LoyaltyController`, `LoyaltyServiceImpl` |
| Invoice | PDF-рахунок (iText) | `BookingController` + `InvoiceServiceImpl` |
| Admin analytics | Дашборд, зайнятість, sentiment по кімнатах | `AdminAnalyticsController`, `AdminAnalyticsServiceImpl` |
| Admin pricing | CRUD правил | `AdminPricingRuleController` |
| Admin users | Список користувачів, зміна ролі | `AdminUserController` |
| Admin audit | Читання audit_logs | `AdminAuditController` |
| Exceptions | Єдиний JSON-формат помилок | `ApiExceptionHandler` (+ валідація Bean Validation) |

## 3. Таблиця REST API (для додатка до записки)

Базовий префікс: `/api`. Відповіді JSON зазвичай в обгортці `ApiResponse` (крім PDF).

| Метод і шлях | Роль / доступ | Короткий опис |
|--------------|---------------|---------------|
| POST `/auth/register`, `/auth/login`, `/auth/refresh` | Публічно | Облікові записи та токени |
| GET `/rooms`, `/rooms/{id}` | Публічно | Номери |
| POST/PUT/DELETE `/rooms`… | MANAGER/ADMIN (DELETE — ADMIN) | Управління номерами |
| POST/GET `/bookings`, GET `/bookings/{id}` | Авторизовані | Бронювання |
| PUT `/bookings/{id}/status` | Авторизовані (гість — лише скасування свого) | Статус |
| GET `/bookings/{id}/invoice` | Власник або персонал | PDF |
| POST `/bookings/{id}/pay` | Власник | Оплата |
| GET `/services`, `/services/{id}` | Публічно | Каталог послуг |
| GET `/services/recommendations` | Авторизовані | Топ за popularity |
| POST/PUT/DELETE `/services`… | MANAGER/ADMIN | CRUD послуг |
| POST/GET `/service-orders`, PUT `…/status` | Користувач / персонал для статусу | Замовлення послуг |
| GET `/reviews` | Публічно (непідтверджені — лише MANAGER/ADMIN) | Відгуки |
| POST `/reviews` | Авторизований гість | Створення відгуку |
| PUT `/reviews/{id}/approve` | MANAGER/ADMIN | Модерація |
| DELETE `/reviews/{id}` | ADMIN | Видалення |
| GET `/loyalty/balance` | Авторизовані | Бали та «еквівалент знижки» |
| GET `/admin/analytics/dashboard` | MANAGER/ADMIN | KPI |
| GET `/admin/analytics/occupancy-forecast` | MANAGER/ADMIN | Прогноз зайнятості 14 днів |
| GET `/admin/analytics/room-sentiment` | MANAGER/ADMIN | Середній sentiment по кімнатах |
| CRUD `/admin/pricing-rules` | MANAGER/ADMIN | Правила ціноутворення |
| GET `/admin/users`, PUT `/admin/users/{id}/role` | MANAGER/ADMIN + роль лише ADMIN для PUT | Користувачі |
| GET `/admin/audit-logs` | ADMIN | Журнал аудиту |

## 4. Клієнтський застосунок (`frontend/`)

- **Стек:** React 18, Vite 6, TypeScript strict, Tailwind, TanStack Query v5, Zustand (persist), Axios (черга refresh на 401), Framer Motion, Recharts, Zod + React Hook Form.
- **Запуск:** `npm run dev:diploma-frontend` з кореня репозиторію (або `cd frontend && npm run dev`). Vite проксує `/api` на `http://localhost:8080`; Spring зазвичай з `--spring.profiles.active=dev` для CORS.
- **Маршрути (узгоджено з `frontend/src/App.tsx`):**
  - **Публічно:** `/`, `/rooms`, `/rooms/:id`, `/services`, `/services/:id`, `/reviews`, `/login`, `/register`, `*` → сторінка 404.
  - **Після входу (гість):** `/guest` (дашборд), `/guest/bookings`, `/guest/orders`, `/guest/profile`, `/guest/loyalty`, `/guest/reviews/write`, бронювання `/rooms/:id/book`.
  - **Персонал ресепшну:** `/staff/orders` — лише `RECEPTIONIST` (`StaffRoute`).
  - **Адмін:** `/admin/*` — `MANAGER` / `ADMIN` (`AdminRoute`); підмаршрути: `analytics`, `rooms`, `services`, `service-orders`, `reviews` (модерація), `pricing`, `users`, `audit`. Аудит і зміна ролей на бекенді — обмеження для `ADMIN`.

## 5. Що писати в розділі «Безпека»

- Stateless **JWT**, фільтр `JwtAuthFilter`, відмова від сесій.
- **RBAC** через `SecurityConfig` (`hasRole` / `hasAnyRole`).
- Гість може **скасувати лише своє** бронювання (логіка в `BookingServiceImpl`, не лише в security).
- Валідація вхідних DTO — **Bean Validation** + обробка `MethodArgumentNotValidException`.

## 6. Ризики / обмеження (чесно для записки)

- **Audit_logs**: таблиця є, REST для перегляду реалізовано; масове логування змін з бізнес-операцій можна розширити окремим аспектом.
- **Sentiment**: спрощена лексикон-модель (`SentimentAnalysis`), не ML.
- **Maven Wrapper**: у репозиторії може не бути повного `.mvn/wrapper/*.jar` — для збірки використовуйте локальний `mvn` або відновіть wrapper.

Оновлюйте цей файл при зміні API перед захистом.
