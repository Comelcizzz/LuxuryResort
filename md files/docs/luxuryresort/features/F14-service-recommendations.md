# F14 — RecommendationService (Algorithm 2)

## Related Execution Order step(s)

- **Step 7** — [promt.md](../../../promt.md) **Algorithm 2 — Service Recommendation Engine**

## Status

`Not started`

## Spec source

- [promt.md](../../../promt.md) — TF-IDF по категоріях, α/β/γ ваги, `GET /api/services/recommendations`, popularity_score, `RatingScore` default 0.5

## Acceptance checklist

- [ ] `RecommendationService.getRecommendations(userId, limit)` за pseudocode promt.
- [ ] Порожня історія → топ за `popularity_score`, relevance 0.5, tag `"popular"`.
- [ ] Інакше: TF-IDF по категоріях замовлень, виключення вже замовлених сервісів, сортування за relevance.
- [ ] `GET /api/services/recommendations` — персоналізовано для поточного користувача.
- [ ] Оновлення `popularity_score` за формулою promt (останні 30 днів) — scheduled або batch.

## Dependencies

- [F12](F12-service-service-orders.md) — історія замовлень
- [F04](F04-jpa-repositories.md) — підрахунки `countUsersWhoOrderedCategory`, `count`

## Legacy (coursework) note

Курсова без **колаборативних рекомендацій** та TF-IDF — окремий **алгоритмічний** блок диплому.

## Thesis section hint

«Система рекомендацій послуг», математична модель, параметри α, β, γ.

## Notes / Risks

- Performance: кеш або materialized stats при великій кількості користувачів.

**Spec:** [promt.md](../../../promt.md)
