# F22 — Frontend tests (Vitest + React Testing Library)

## Related Execution Order step(s)

- **Step 15** — [promt.md](../../../promt.md) **Tests to Write** (frontend)

## Status

`Done`

## Spec source

- [promt.md](../../../promt.md) — `BookingWizard.test.tsx`, `PricingBreakdownPanel.test.tsx`, `RecommendedServices.test.tsx`

## Acceptance checklist

- [x] Vitest + RTL налаштовані для Vite + React (`frontend/vitest.config.ts`, `src/test/setup.ts`).
- [x] `BookingWizard` — валідація кроку дат, перехід після доступності, pricing + оплата (з моками API).
- [x] `PricingBreakdownPanel` — рядки правил, підсумок, згортання панелі.
- [x] `RecommendedServices` — завантаження, empty state, список рекомендацій.

## Запуск

З кореня репозиторію: `npm run test:diploma-frontend` або з `frontend/`: `npm run test`.

## Dependencies

- [F21](F21-frontend-pages-flows.md)

## Legacy (coursework) note

Якщо курсова без фронтенд-тестів — обовʼязкове доповнення для **диплому** за promt.

## Thesis section hint

«Модульне тестування клієнтської частини».

## Notes / Risks

- MSW для мокання API під інтеграційні компонентні тести — опційно; зараз використано `vi.mock` на шарі endpoints.

**Spec:** [promt.md](../../../promt.md)
