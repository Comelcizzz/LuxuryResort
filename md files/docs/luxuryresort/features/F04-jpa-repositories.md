# F04 — Spring Data JPA repositories

## Related Execution Order step(s)

- **Step 4** — [promt.md](../../../promt.md) (`domain/repository`)

## Status

`In progress` (базові `JpaRepository` для всіх сутностей; кастомні `@Query` — з F07–F16)

## Spec source

- [promt.md](../../../promt.md) — репозиторії для сутностей; кастомні запити для алгоритмів (ціноутворення, зайнятість, рекомендації, аудит)

## Acceptance checklist

- [x] `JpaRepository` для кожної основної сутності.
- [x] `PricingRuleRepository`: активні правила `findAllByActiveIsTrue(Sort)` (сортування за `priority` у сервісі); фільтрація за типом/датами — у `DynamicPricingServiceImpl` (F09).
- [x] `BookingRepository`: перетин активних бронювань з діапазоном дат (`countActiveOverlap`) — для F08 availability / далі F10.
- [ ] Методи для `ServiceOrder` / категорій — під TF-IDF та popularity (F14).
- [ ] `AuditLog` — фільтрація за `entityType`, `entity_id`, датами (під admin API).
- [x] `RefreshToken` — пошук за hash + non-revoked (`findByTokenHashAndRevokedFalse`), масовий revoke (F07).

## Dependencies

- [F03](F03-jpa-entities.md)

## Legacy (coursework) note

У Express логіка запитів розкидана по сервісах і Mongoose query. Тут — **централізовані** Spring Data інтерфейси + `@Query` де потрібно.

## Thesis section hint

«Доступ до даних», короткий опис ключових запитів до БД.

## Notes / Risks

- Проекції (`interface`-based) для DTO звітів адмінки зменшать навантаження.
- Для concurrency IT (F18) важливі атомарні операції / обробка unique/exclude violations.

**Spec:** [promt.md](../../../promt.md)
