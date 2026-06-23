# F15 — OccupancyForecastService (Algorithm 3)

## Related Execution Order step(s)

- **Step 7** — [promt.md](../../../promt.md) **Algorithm 3 — Occupancy Forecasting**

## Status

`Not started`

## Spec source

- [promt.md](../../../promt.md) — exponential smoothing, α=0.3, 60 days history, forecast 30 days, `getPricingPressureForDate`, `GET /api/admin/analytics/forecast`

## Acceptance checklist

- [ ] `forecastNext30Days()` (або еквівалент) за pseudocode: `totalRooms`, daily occupancy projections, згладжування, прогноз на 30 днів.
- [ ] Коригування прогнозу множником цінового тиску (коефіцієнт 0..1 з правил) як у promt.
- [ ] `GET /api/admin/analytics/forecast` — масив `{ date, predictedOccupancyRate }` (узгодити імена полів з DTO).
- [ ] Доступ **MANAGER+** за RBAC матрицею (analytics).

## Dependencies

- [F04](F04-jpa-repositories.md) — агрегації бронювань по датах
- [F09](F09-service-dynamic-pricing.md) або репозиторій правил — для pricing pressure

## Legacy (coursework) note

Адмінка курсової без **прогнозу завантаження** на 30 днів — новий аналітичний модуль.

## Thesis section hint

«Прогноз завантаженості номерного фонду», експоненційне згладжування, візуалізація (F21 Recharts).

## Notes / Risks

- Якщо мало даних — початкове `smoothed = 0.5` як у promt.

**Spec:** [promt.md](../../../promt.md)
