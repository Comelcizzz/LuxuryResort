# E2E manual checklist — ALL FLOWS (~5–10 min)

**Path:** `docs/E2E_MANUAL_CHECKLIST_ALL_FLOWS.md`

Use this as a **strict** pass/fail list. Mark each row **PASS** / **FAIL** and note HTTP status or UI message on failure.

**Fastest 5-minute path:** A1 → A2 → A3 → A5 → A8 → B2 → C1 → C2 → D1 → D2 → F1 → G1 → G2 → A12.

## Preconditions

| # | Step | Expected |
|---|------|----------|
| P1 | Backend running on API base (e.g. Vite proxy `http://localhost:5173/api/...`) | No connection errors in browser Network tab |
| P2 | Frontend running at `http://localhost:5173` | Home loads |
| P3 | PostgreSQL migrated with dev seeds (Flyway `V2`–`V6`) | Lists are non-empty where noted |

## Demo accounts (password for all: `Passw0rd!`)

| Role | Email |
|------|--------|
| ADMIN | `admin@luxuryresort.local` |
| MANAGER | `manager@luxuryresort.local` |
| RECEPTIONIST | `reception@luxuryresort.local` |
| GUEST | `guest@luxuryresort.local` |

**Before each role block:** open DevTools → Network → XHR/Fetch, or use “Disable cache”.

---

## A. Public (unauthenticated)

| ID | Steps | Expected |
|----|-------|----------|
| A1 | Open `http://localhost:5173/` | Hero + nav; no infinite loading |
| A2 | Nav **Номери** → `/rooms` | Grid/cards; `GET /api/rooms` **200** |
| A3 | On `/rooms`, type `Suite` in search, wait debounce | URL has `q=Suite`; `GET /api/rooms?...&q=Suite` **200**; results filtered |
| A4 | Click first room → `/rooms/:id` | Detail page; room data visible |
| A5 | Nav **Послуги** → `/services` | List; `GET /api/services` **200** |
| A6 | Search `Yoga` | `GET /api/services?...&q=Yoga` **200** |
| A7 | Click **Деталі** on one service → `/services/:id` | Detail; price/duration if shown |
| A8 | Nav **Відгуки** → `/reviews` | Approved reviews; `GET /api/reviews?approved=true...` **200** |
| A9 | Set rating filter **Від 4** | URL `ratingMin=4`; API **200**; only4–5 star (or empty if seed differs) |
| A10 | Open `/login` | Login form; **Увійти** enabled after fill |
| A11 | Open `/register` | Registration form loads |
| A12 | Open bogus path `/this-route-does-not-exist` | **404** / NotFound page (not blank) |

---

## B. Auth

| ID | Steps | Expected |
|----|-------|----------|
| B1 | Log out if logged in (header **Вийти**) | Redirect to public; guest nav without “Кабінет” deep links working only after login |
| B2 | `/login` → email `guest@luxuryresort.local`, password `Passw0rd!` → **Увійти** | Redirect to `/` or guest area; **Кабінет** / guest links visible |
| B3 | **Вийти** | Session cleared; protected routes redirect to login when opened directly |

---

## C. Guest (logged in as `guest@luxuryresort.local`)

| ID | Steps | Expected |
|----|-------|----------|
| C1 | `/guest` | Dashboard; `GET /api/bookings`, `GET /api/service-orders`, `GET /api/loyalty/balance` **200** |
| C2 | `/guest/bookings` | List + pagination; `GET /api/bookings` **200** |
| C3 | Search `Suite` | `GET /api/bookings?...&q=Suite` **200** |
| C4 | `/guest/orders` | Page loads; search `SPA` → `GET /api/service-orders?...&q=SPA` **200** (may be empty list) |
| C5 | `/guest/profile` | Profile form/fields; save if present — no unhandled error toast |
| C6 | `/guest/loyalty` | Loyalty UI; API **200** or empty state without crash |
| C7 | `/guest/reviews/write` | Booking dropdown populated; `GET /api/bookings` (wizard list) **200** |
| C8 | Open `/rooms` → pick a room → if **Забронювати** / book flow exists, start wizard OR open `/rooms/<uuid-or-id>/book` | Either wizard loads (**200** on pricing/availability calls) OR login gate if session missing |

---

## D. Admin (logged in as `admin@luxuryresort.local`)

| ID | Steps | Expected |
|----|-------|----------|
| D1 | `/admin` or `/admin/analytics` | Admin shell + sidebar; **not** redirected to `/` |
| D2 | `/admin/analytics` | Charts/widgets; `GET /api/admin/analytics/dashboard` **200** (and related analytics calls **200**) |
| D3 | `/admin/rooms` | Table/cards; `GET /api/rooms` **200**; pagination works |
| D4 | `/admin/services` | List; search e.g. `SPA` → `GET /api/services?...&q=SPA` **200** |
| D5 | `/admin/service-orders` | Page loads (may be empty); no **500** |
| D6 | `/admin/reviews` | Moderation queue; search `great` → `GET /api/reviews?approved=false...` **200** |
| D7 | `/admin/pricing` | Rules list; search `week` → `GET /api/admin/pricing-rules?...&q=week` **200** |
| D8 | `/admin/users` | Users; search `guest` → `GET /api/admin/users?...&q=guest` **200** |
| D9 | `/admin/audit` | Set entity filter e.g. `BOOKING` → `GET /api/admin/audit-logs?...` **200** |

---

## E. Manager (logged in as `manager@luxuryresort.local`)

| ID | Steps | Expected |
|----|-------|----------|
| E1 | `/admin/analytics` | Admin shell loads; `GET /api/admin/analytics/*` **200** |
| E2 | `/admin/users` | Сторінка відкривається, список користувачів видно; **зміна ролей вимкнена** (dropdown **disabled**) і є підказка «лише адміністратор»; `GET /api/admin/users` **200** (read-only для менеджера) |
| E3 | Перевірити бічне меню | Пункт **Аудит** зазвичай **прихований** для не-ADMIN (як у поточному UI) — **PASS**, якщо поведінка стабільна |

---

## F. Reception / staff (logged in as `reception@luxuryresort.local`)

| ID | Steps | Expected |
|----|-------|----------|
| F1 | `/staff/orders` | Staff queue page; header shows staff/reception label |
| F2 | `/admin/analytics` (direct URL) | **Must NOT** show admin analytics: redirect home or **403** on API — consistent with `AdminRoute` |

---

## G. Negative / security (quick)

| ID | Steps | Expected |
|----|-------|----------|
| G1 | Logged out → open `/guest` | Redirect to login (or auth wall), not silent empty admin |
| G2 | Guest user → open `/admin/rooms` | No admin UI (redirect / forbidden) |
| G3 | Wrong password on `/login` | Залишаєтесь на `/login`; `POST /api/auth/login` **401** (або інший очікуваний 4xx); повідомлення про помилку в UI; **немає** серії **500** |

---

## Done criteria

- All **A**–**G** rows **PASS** for your environment.
- No unexpected **500** on list endpoints under normal filters.
- URL query params (`page`, `size`, `q`, `sort`, filters) stay in sync after filter change (page resets where implemented).

---

## Last automated run (fill when testing)

| Date | Tester | Result | Notes |
|------|--------|--------|-------|
| 2026-04-15 | Cursor MCP `cursor-ide-browser` | **PASS** (повний прогін A–G) | Усі рядки A1–A12, B1–B3, C1–C8, D1–D9, E1–E3, F1–F2, G1–G3 перевірені в одній сесії браузера MCP на `http://localhost:5173` (проксі API). Ключові HTTP: публічні списки **200**; `POST /api/auth/login` **401** при невірному паролі; гостьові/адмін-ендпоінти за чеклистом **200**; броню-візард: `GET .../availability?checkIn&checkOut` **200**; ресепшн: `/admin/analytics` → редірект на `/`. Неочікуваних **500** на перелічених list endpoints не спостерігалося. |
