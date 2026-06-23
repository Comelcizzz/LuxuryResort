# F10 — BookingService (overlap, statuses, loyalty points fields)

## Related Execution Order step(s)

- **Step 7** (четвертий сервіс) — [promt.md](../../../promt.md) REST Bookings, overlap constraint

## Status

`Done` — `BookingService`/`BookingController`; pay/invoice (F11/F16) окремо.

## Spec source

- [promt.md](../../../promt.md) — **Bookings** API, зв’язок з DynamicPricing, loyalty_points_earned/used, статуси `booking_status`

## Acceptance checklist

- [x] `POST /api/bookings` — `CreateBookingRequest`; відповідь з **PricingResult** через `BookingMapper.toResponse(booking, pricing)`.
- [x] Запис `base_total`, `dynamic_price_total` (= final з F09), `final_multiplier`, `pricing_snapshot` (`DynamicPricingService.toSnapshot`).
- [x] Списання `loyalty_points` у користувача при створенні; **refund** при `CANCELLED` / **нарахування earned** при `CHECKED_OUT` (базова логіка F16).
- [x] `BookingConflictException` + `saveAndFlush` / `DataIntegrityViolationException` → 409; попередня перевірка через `RoomService.availability`.
- [x] `GET /api/bookings` — GUEST лише свої (`findPageForUser`), інші ролі — `findPageAll`.
- [x] `GET /api/bookings/{id}` (перегляд чужого — **403**), `PUT .../status` (GUEST заборонено), `DELETE` — RBAC F06.
- [x] Обмежені переходи статусів (`PENDING→…`, `CONFIRMED→…`, `CHECKED_IN→…`).
- [ ] Відгук лише після CHECKED_OUT — **F13**.

## Dependencies

- [F09](F09-service-dynamic-pricing.md)
- [F07](F07-service-auth.md)

## Legacy (coursework) note

`BookingService.js` — базове бронювання без pricing rules і без exclusion на рівні БД.

## Thesis section hint

«Життєвий цикл бронювання», діаграма станів, запобігання колізіям.

## Notes / Risks

- Транзакційність: створення бронювання + оновлення loyalty в одній транзакції де потрібно.
- F18 concurrency IT: 10 паралельних спроб → рівно 1 успіх.

**Spec:** [promt.md](../../../promt.md)
