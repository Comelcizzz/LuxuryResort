# F02 — Flyway database schema (V1__init)

## Related Execution Order step(s)

- **Step 2** — [promt.md](../../../promt.md) (Database Schema — All Flyway Migrations)

## Status

`Done` (V1 + dev seed V2; схема синхронізована з оновленим [promt.md](../../../promt.md))

## Spec source

- [promt.md](../../../promt.md) — **V1__init.sql**: enums, усі таблиці, індекси, `EXCLUDE` constraint на `bookings`

## Acceptance checklist

- [x] Розширення `uuid-ossp` та `btree_gist` (для `EXCLUDE` з `room_id`).
- [x] Усі ENUM типи: `user_role`, `room_type`, `room_status`, `booking_status`, `payment_status`, `service_category`, `order_status`, `audit_action`, `rule_type`.
- [x] Таблиці: `users`, `rooms`, `pricing_rules`, `bookings`, `payments`, `services`, `service_orders`, `reviews`, `audit_logs`, `refresh_tokens` з полями як у специфікації + `reviews.images`, `rooms.deleted_at`, `services.deleted_at`; без `UNIQUE(booking_id)` на `reviews` (узгоджено з планом диплому).
- [x] FK та обмеження; `UNIQUE(booking_id)` на відгуках **не** застосовується.
- [x] Constraint `no_overlap` з `EXCLUDE USING gist` для `room_id` + `daterange` з умовою `WHERE status NOT IN ('CANCELLED','NO_SHOW')`.
- [x] Індекси: `idx_bookings_room_dates`, `idx_bookings_user`, `idx_audit_entity`, `idx_reviews_room`.
- [ ] Міграція успішно накатується на чистий PostgreSQL 16 (див. Docker F24) — перевірити локально / у CI при наявності Postgres.

## Dependencies

- [F01](F01-backend-bootstrap.md) — Flyway у POM та конфіг datasource.

## Legacy (coursework) note

Курсова використовувала **MongoDB** + Mongoose-схеми без SQL і без жорстких exclusion-обмежень. Диплом: **реляційна модель + міграції** — новий артефакт для записки (ERD у F23).

## Thesis section hint

«Проєктування бази даних», діаграма ER, опис цілісності та запобігання подвійному бронюванню одного номера.

## Notes / Risks

- Для `EXCLUDE ... gist` з `room_id` типу UUID у PostgreSQL часто потрібне розширення **`btree_gist`**: перевірити під час імплементації; якщо promt-копія падає — додати `CREATE EXTENSION IF NOT EXISTS btree_gist` перед constraint (зафіксувати в міграції після перевірки на PG16).
- `daterange` у exclusion: узгодити семантику `[check_in, check_out)` з бізнес-логікою F10.

**Spec:** [promt.md](../../../promt.md)
