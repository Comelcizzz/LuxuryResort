# LuxuryResort — diploma execution roadmap

## Preamble

- **Академічно:** дипломна робота — це **переробка курсової** (той самий домен LuxuryResort: готель, послуги, бронювання). Курсова задокументована в [Курсова.md](../../Курсова.md); код курсової (MERN) — **`legacy/backend/`** та **`legacy/frontend/`**; дипломний Spring — кореневий **`backend/`**.
- **Технічно:** єдине ТЗ дипломної реалізації — [promt.md](../../promt.md). Порядок робіт — **Execution Order** (кроки 1–17 у кінці `promt.md`); не перескакувати кроки.
- **Трекінг:** детальні чеклісти — у [features/README.md](features/README.md) та файлах `features/F*.md`.

## Execution Order → features → status

Оновлюй колонку **Status** при прогресі (узгоджено з відповідним `F*.md`).

| Step | Description (from promt) | Feature docs | Status |
|------|---------------------------|--------------|--------|
| 1 | Full `pom.xml` with all dependencies | [F01](features/F01-backend-bootstrap.md) | Done |
| 2 | All Flyway SQL migrations | [F02](features/F02-flyway-schema.md) | Done |
| 3 | All JPA entities + Lombok | [F03](features/F03-jpa-entities.md) | Done |
| 4 | Spring Data JPA repositories | [F04](features/F04-jpa-repositories.md) | In progress |
| 5 | DTOs (request + response) + MapStruct mappers | [F05](features/F05-dtos-mapstruct.md) | Done |
| 6 | `SecurityConfig` + `JwtService` + `JwtAuthFilter` | [F06](features/F06-security-jwt.md) | Done |
| 7 | Services: Auth → Room → … → Audit (see F07–F16) | [F07](features/F07-service-auth.md) … [F16](features/F16-service-invoice-loyalty-audit.md) | Done |
| 8 | REST controllers + `GlobalExceptionHandler` | [F17](features/F17-rest-controllers-exceptions.md) | Done |
| 9 | JUnit 5 + Mockito + Testcontainers IT | [F18](features/F18-backend-tests.md) | Not started |
| 10 | Vite + React + TS + Tailwind + shadcn/ui | [F19](features/F19-frontend-init-design-system.md) | Done |
| 11 | `client.ts` Axios + typed API functions | [F20](features/F20-frontend-api-state.md) | Done |
| 12 | Zustand + TanStack Query hooks | [F20](features/F20-frontend-api-state.md) | Done |
| 13 | Pages: Home → … → Admin dashboard | [F21](features/F21-frontend-pages-flows.md) | Done |
| 14 | Framer Motion animations | [F21](features/F21-frontend-pages-flows.md) | Done |
| 15 | Frontend tests (Vitest + RTL) | [F22](features/F22-frontend-tests.md) | Done |
| 16 | Mermaid diagrams under `docs/` | [F23](features/F23-academic-diagrams.md) | Done |
| 17 | `docker-compose.yml` + `.env.example` + README | [F24](features/F24-docker-readme-env.md) | Done |

### Step 7 breakdown (services order — non-negotiable)

Auth → Room → DynamicPricing → Booking → Payment → ServiceOrder → Review → Recommendation → OccupancyForecast → Sentiment → Invoice → Loyalty → Audit — мапиться на [F07](features/F07-service-auth.md)–[F16](features/F16-service-invoice-loyalty-audit.md) у тому ж порядку.

## Відповідність запиці (орієнтир для диплому)

Типові розділи дипломної записки (уточнити за методичкою ЗВО) та зв’язок з кроками:

| Типовий розділ записки | Execution steps / docs |
|------------------------|-------------------------|
| Вступ, предметна область | Курсова + [promt.md](../../promt.md) § Project Goal |
| Технічне завдання / вимоги | [promt.md](../../promt.md) globally; RBAC, REST |
| Проєктування БД | Step 2 → F02; ER — F23 |
| Проєктування архітектури | F06, F17, F23 component diagram |
| Реалізація backend | Steps 1–9, F01–F18 |
| Реалізація frontend | Steps 10–15, F19–F22 |
| Алгоритми (ціноутворення, рекомендації, прогноз, сентимент) | F09, F14, F15, F13 |
| Безпека | F06, F07; sequence-auth F23 |
| Тестування | F18, F22 |
| Розгортання, інструкції | F24 |
| Висновки | За результатами всіх `F*.md` зі статусом Done |

## Links

- Огляд каталогу `docs/luxuryresort`: [README.md](README.md)
- Індекс фіч: [features/README.md](features/README.md)
- ТЗ диплому: [promt.md](../../promt.md)
- Курсова (контекст «було»): [Курсова.md](../../Курсова.md)
