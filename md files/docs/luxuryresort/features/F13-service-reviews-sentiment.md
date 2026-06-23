# F13 — ReviewService + SentimentAnalysisService (Algorithm 4)

## Related Execution Order step(s)

- **Step 7** — у ланцюжку сервісів promt: `… Review → Recommendation → OccupancyForecast → Sentiment …`. Цей файл: **ReviewService** + **SentimentAnalysisService** (Algorithm 4).

## Status

`Not started`

## Spec source

- [promt.md](../../../promt.md) — **Algorithm 4 — Review Sentiment Scoring**, REST Reviews, admin sentiment analytics

## Acceptance checklist

- [ ] `GET /api/reviews?roomId=&approved=true`
- [ ] `POST /api/reviews` — `{ bookingId, rating, comment }`; лише для бронювання в статусі **CHECKED_OUT**; `UNIQUE(booking_id)`
- [ ] `PUT /api/reviews/{id}/approve` — **MANAGER+**; `DELETE` — **ADMIN**
- [ ] `SentimentAnalysisService`: лексикон UK+EN, формула sentiment / normalized ∈ [0,1], запис у `reviews.sentiment_score`
- [ ] Оновлення `rooms.avg_rating` / `review_count` при затвердженні (узгодити бізнес-правила)
- [ ] `GET /api/admin/analytics/sentiment` — середній сентимент по кімнатах (для адмін UI F21)

## Dependencies

- [F10](F10-service-bookings.md)
- [F04](F04-jpa-repositories.md)

## Legacy (coursework) note

Відгуки в курсовій без **лексиконного сентименту** та без модерації `is_approved` на рівні promt.

## Thesis section hint

«Аналіз тональності відгуків», лексикон, нормалізація, використання в аналітиці.

## Notes / Risks

- Розширити лексикон обережно (коректність українських слів).

**Spec:** [promt.md](../../../promt.md)
