# F17 — REST controllers + GlobalExceptionHandler + ApiResponse

## Related Execution Order step(s)

- **Step 8** — [promt.md](../../../promt.md) REST API (усі групи), **Global Response Envelope**, `web/controller`, `web/advice`

## Status

`Not started`

## Spec source

- [promt.md](../../../promt.md) — **REST API** (Auth, Rooms, Bookings, Services, Reviews, Admin), **ApiResponse&lt;T&gt;**, package structure `web/`

## Acceptance checklist

- [ ] Усі ендпоінти з promt реалізовані та узгоджені з RBAC (окремо перевірити матрицю).
- [ ] Єдиний envelope `ApiResponse<T>`: `ok(data)`, `error(msg, errors)`.
- [ ] `GlobalExceptionHandler` — мапінг валідаційних помилок, 401/403/404, конфлікт бронювань, помилки оплати.
- [ ] `OpenApiConfig` — springdoc, опис основних операцій.
- [ ] Один controller на домен (за promt).

## Dependencies

- [F07](F07-service-auth.md) … [F16](F16-service-invoice-loyalty-audit.md) — усі сервісні шари готові або контролери додаються інкрементно з TDD (рекомендовано після стабілізації DTO).

## Legacy (coursework) note

Express `routes/*.js` — плоска структура; диплом — **шар контролерів** + уніфіковані відповіді.

## Thesis section hint

«Реалізація REST API», таблиця маршрутів у додатку до записки.

## Notes / Risks

- Не дублювати бізнес-логіку в контролерах — лише делегування в сервіси.

**Spec:** [promt.md](../../../promt.md)
