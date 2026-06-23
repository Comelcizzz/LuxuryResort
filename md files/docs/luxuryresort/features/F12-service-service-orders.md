# F12 — ServiceOrderService

## Related Execution Order step(s)

- **Step 7** (шостий сервіс) — [promt.md](../../../promt.md) REST Services & Orders

## Status

`Not started`

## Spec source

- [promt.md](../../../promt.md) — `GET/POST` service-orders, `PUT .../status`, таблиця `service_orders`

## Acceptance checklist

- [ ] `GET /api/service-orders` (фільтрація за роллю користувача — власні для гостя, розширені для персоналу за потреби ТЗ)
- [ ] `POST /api/service-orders` — serviceId, bookingId optional, appointment, quantity, total_price, specialRequests; статуси `order_status`
- [ ] `PUT /api/service-orders/{id}/status`
- [ ] CRUD сервісів: `GET/POST/PUT /api/services` з RBAC **MANAGER+**
- [ ] Оновлення `popularity_score` (нічний job або тригер — узгодити з F14; promt описує nightly update)

## Dependencies

- [F10](F10-service-bookings.md) — опційне посилання booking_id
- [F07](F07-service-auth.md)

## Legacy (coursework) note

`ServiceOrderService.js`, замовлення послуг — функціонал курсової; диплом додає **категорії, popularity_score, зв’язок з рекомендаціями**.

## Thesis section hint

«Додаткові послуги та замовлення», життєвий цикл замовлення.

## Notes / Risks

- Розрахунок `total_price` = price * quantity з актуальною ціною сервісу.

**Spec:** [promt.md](../../../promt.md)
