# F18 — Backend tests (JUnit 5, Mockito, Testcontainers)

## Related Execution Order step(s)

- **Step 9** — [promt.md](../../../promt.md) **Tests to Write** (backend частина)

## Status

`Not started`

## Spec source

- [promt.md](../../../promt.md) — перелік тестів + **BookingConcurrencyIT**

## Acceptance checklist

- [ ] `DynamicPricingServiceTest` — кожен тип правила, комбінації мультиплікаторів, cap лояльності.
- [ ] `RecommendationServiceTest` — порожня історія, TF-IDF, виключення вже замовлених.
- [ ] `BookingServiceTest` — happy path, спроба double-book, відкат при невдалій оплаті.
- [ ] `AuthServiceTest` — register, login, refresh, logout / invalidation refresh.
- [ ] **Testcontainers** `BookingConcurrencyIT` — 10 одночасних спроб на ті самі room/dates → **рівно одна** успішна.

## Dependencies

- [F17](F17-rest-controllers-exceptions.md) або мінімальний інтеграційний контур сервісів + БД (IT зазвичай після стабільної F02–F11).

## Legacy (coursework) note

Якщо в курсовій не було автотестів — диплом вимагає **явного** покриття критичної логіки.

## Thesis section hint

«Тестування програмних модулів», модульні та інтеграційні тести, сценарій конкурентного бронювання.

## Notes / Risks

- CI: Docker для Testcontainers на агентах збірки.

**Spec:** [promt.md](../../../promt.md)
