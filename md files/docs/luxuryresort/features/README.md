# LuxuryResort diploma — feature tracking index

Навігація вгору: [../README.md](../README.md) (огляд `docs/luxuryresort`), [../ROADMAP.md](../ROADMAP.md) (Execution Order 1–17).

Цей каталог містить **окремий markdown на кожну логічну фічу** дипломного проєкту (переробка курсової MERN → enterprise-стек за [promt.md](../../../promt.md)).

## Legend / легенда статусів

| Status        | Meaning |
|---------------|---------|
| `Not started` | Не розпочато |
| `In progress` | В роботі |
| `Blocked`     | Заблоковано залежностями або зовнішніми факторами |
| `Done`        | Виконано за критеріями в файлі |

## Spec source of truth

- **Технічне ТЗ диплому:** [promt.md](../../../promt.md) (зокрема **Execution Order**, рядки ~758–777).
- **Курсова (предметна область, «було»):** [Курсова.md](../../../Курсова.md) — не ТЗ коду, а матеріал для записки (порівняння, постановка задачі).

## Feature files

| ID   | File | Execution Order | Status (global) |
|------|------|-----------------|-----------------|
| F01  | [F01-backend-bootstrap.md](F01-backend-bootstrap.md) | Step 1 | Done |
| F02  | [F02-flyway-schema.md](F02-flyway-schema.md) | Step 2 | Done |
| F03  | [F03-jpa-entities.md](F03-jpa-entities.md) | Step 3 | Done |
| F04  | [F04-jpa-repositories.md](F04-jpa-repositories.md) | Step 4 | In progress |
| F05  | [F05-dtos-mapstruct.md](F05-dtos-mapstruct.md) | Step 5 | Done |
| F06  | [F06-security-jwt.md](F06-security-jwt.md) | Step 6 | Done |
| F07  | [F07-service-auth.md](F07-service-auth.md) | Step 7 | Done |
| F08  | [F08-service-rooms.md](F08-service-rooms.md) | Step 7 | Done |
| F09  | [F09-service-dynamic-pricing.md](F09-service-dynamic-pricing.md) | Step 7 | Done |
| F10  | [F10-service-bookings.md](F10-service-bookings.md) | Step 7 | Done |
| F11  | [F11-service-payments.md](F11-service-payments.md) | Step 7 | Done |
| F12  | [F12-service-service-orders.md](F12-service-service-orders.md) | Step 7 | Not started |
| F13  | [F13-service-reviews-sentiment.md](F13-service-reviews-sentiment.md) | Step 7 | Not started |
| F14  | [F14-service-recommendations.md](F14-service-recommendations.md) | Step 7 | Not started |
| F15  | [F15-service-occupancy-forecast.md](F15-service-occupancy-forecast.md) | Step 7 | Not started |
| F16  | [F16-service-invoice-loyalty-audit.md](F16-service-invoice-loyalty-audit.md) | Step 7 | Not started |
| F17  | [F17-rest-controllers-exceptions.md](F17-rest-controllers-exceptions.md) | Step 8 | Not started |
| F18  | [F18-backend-tests.md](F18-backend-tests.md) | Step 9 | Not started |
| F19  | [F19-frontend-init-design-system.md](F19-frontend-init-design-system.md) | Step 10 | Not started |
| F20  | [F20-frontend-api-state.md](F20-frontend-api-state.md) | Step 11–12 | Not started |
| F21  | [F21-frontend-pages-flows.md](F21-frontend-pages-flows.md) | Step 13–14 | Not started |
| F22  | [F22-frontend-tests.md](F22-frontend-tests.md) | Step 15 | Done |
| F23  | [F23-academic-diagrams.md](F23-academic-diagrams.md) | Step 16 | Not started |
| F24  | [F24-docker-readme-env.md](F24-docker-readme-env.md) | Step 17 | Done |

## Document template (for new or split features)

Кожен `F*.md` має містити:

1. **Feature ID / Name** (EN)
2. **Related Execution Order step(s)**
3. **Status**
4. **Spec source** — розділи [promt.md](../../../promt.md)
5. **Acceptance checklist**
6. **Dependencies** — інші `F*.md` / кроки
7. **Legacy (coursework) note** — що було в MERN-курсовій
8. **Thesis section hint** — який підрозділ дипломної записки наповнюється
9. **Notes / Risks** — українською

Центральний маршрут: [../ROADMAP.md](../ROADMAP.md).
