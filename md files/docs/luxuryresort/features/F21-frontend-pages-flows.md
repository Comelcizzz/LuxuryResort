# F21 — Pages, Booking wizard, admin UI, Framer Motion

## Related Execution Order step(s)

- **Step 13** — сторінки за порядком promt  
- **Step 14** — Framer Motion анімації

## Status

`Done` (анімації — базові PageTransition + hover; тести F22 окремо)

## Spec source

- [promt.md](../../../promt.md) — **Frontend Structure** (`pages/`, `components/`), **UI Design System** (patterns), Animations

## Acceptance checklist — Pages (Step 13)

- [x] `Home`, `Rooms`, `RoomDetail`, `Services`, `ServiceDetail`
- [x] Auth: `Login`, `Register`
- [x] Guest: `MyBookings`, `MyServices`, `Profile`, `Loyalty` (окремої сторінки Dashboard немає — вхід на Home / бронювання)
- [x] Admin: `AdminLayout`, `Analytics`, `RoomsManage`, `PricingRules`, `AuditLogs`, `UsersManage`
- [x] **BookingWizard** — 4 кроки + Zod.
- [x] `PricingBreakdownPanel` — collapsible + badges.
- [x] Admin: Recharts — Area revenue, Bar by status, Line forecast (історія/прогноз за promt).
- [x] Audit — бейджі дій.

## Acceptance checklist — Motion (Step 14)

- [x] Page transitions: opacity + y, 0.3s (`PageTransition`).
- [x] Card hover: scale 1.02 (`RoomCard`).
- [ ] Modal motion scale (опційно; діалоги Radix без окремого motion).

## Dependencies

- [F20](F20-frontend-api-state.md)

## Legacy (coursework) note

Існуючі сторінки `.jsx` — референс UX; дипломні — **нові** `.tsx` з wizard і адмін-аналітикою.

## Thesis section hint

«Реалізація інтерфейсу користувача», сценарії гостя та адміністратора, скріншоти для записки.

## Notes / Risks

- Доступність (focus trap у модалках Radix) — базові вимоги.

**Spec:** [promt.md](../../../promt.md)
