# F03 — JPA entities + Lombok

## Related Execution Order step(s)

- **Step 3** — [promt.md](../../../promt.md) (Backend Package Structure → `domain/entity`)

## Status

`Done` (базові entity + enums; `@EntityListeners` для аудиту — у F16)

## Spec source

- [promt.md](../../../promt.md) — entities list; таблиці з **V1__init** (F02)

## Acceptance checklist

- [x] Entities: `User`, `Room`, `Booking`, `Payment`, `ServiceEntity`, `ServiceOrder`, `Review`, `PricingRule`, `AuditLog`, `RefreshToken` (+ enums у `domain/enums`).
- [x] Lombok + `@Entity`, `@GeneratedValue(strategy = UUID)` (узгоджено з PostgreSQL `uuid_generate_v4()`).
- [x] JSONB через `@JdbcTypeCode(SqlTypes.JSON)` (`List<String>`, `Map<String,Object>`).
- [x] Зв’язки `@ManyToOne` за FK (решта `@OneToMany` — за потреби в сервісах).
- [ ] `@EntityListeners` аудиту — F16.
- [x] Часові поля `Instant` / `LocalDate` за схемою.

## Dependencies

- [F02](F02-flyway-schema.md) — фіналізована схема V1.

## Legacy (coursework) note

Mongoose-моделі в `legacy/backend/models/` — інша парадигма. Дипломні entity — **нові** класи під PostgreSQL.

## Thesis section hint

«Об’єктна модель предметної області», відображення сутностей на таблиці.

## Notes / Risks

- Enum mapping: `postgresql.EnumType` або STRING — узгодити з нативними PG ENUM.
- Exclusion constraint не мапиться на JPA-аннотацію — цілісність покладається на БД; сервісний шар має коректно обробляти `DataIntegrityViolationException`.

**Spec:** [promt.md](../../../promt.md)
