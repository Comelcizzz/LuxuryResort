# F09 — DynamicPricingService (Algorithm 1)

## Related Execution Order step(s)

- **Step 7** (третій сервіс) — [promt.md](../../../promt.md) **Algorithm 1 — Dynamic Pricing Engine**

## Status

`Done` (інтеграція виклику з `BookingService` + запис `pricing_snapshot` — у F10).

## Spec source

- [promt.md](../../../promt.md) — формула \(P_{final}\), weekend surge sub-formula, pseudocode `calculateDynamicPrice`, збереження `pricing_snapshot` JSONB

## Acceptance checklist

- [x] `DynamicPricingServiceImpl`: мультиплікативна модель; правила з `PricingRuleRepository.findAllByActiveIsTrue(Sort.by(DESC, "priority"))`.
- [x] Умови застосування за `RuleType` як у promt (SEASONAL — перетин дат; WEEKEND_SURGE — лише якщо є сб/нд у `[checkIn, checkOut)`).
- [x] Weekend: \(M = 1 + \text{weekendRatio} \times (\text{surgeFactor} - 1)\), surgeFactor = `multiplier` правила; у `AppliedRuleDto` — ефективний множник.
- [x] Лояльність: `min(max(0, points)/10000, 0.15)` як \(D_{loyalty}\); \(P_{final} = baseTotal \times \prod M_i \times (1 - D)\), scale 2 HALF_UP.
- [x] `pointsEarned` = floor(`finalTotal`) / 100 (як int-ділення у pseudocode).
- [x] Повернення `PricingResult` + `toSnapshot(PricingResult)` → `Map` для JSONB.
- [x] Виклик з `BookingService` + snapshot на сутності `Booking` (F10).

## Dependencies

- [F08](F08-service-rooms.md) — `basePricePerNight` з Room
- [F04](F04-jpa-repositories.md) — PricingRule repository

## Legacy (coursework) note

Курсова не містить формалізованого **динамічного ціноутворення** з правилами — ключове **наукове доповнення** диплому.

## Thesis section hint

Окремий підрозділ «Алгоритм динамічного ціноутворення», формули, приклад розрахунку, блок-схема.

## Notes / Risks

- BigDecimal scale 2, `HALF_UP` як у promt.
- Unit tests F18: усі типи правил, комбінації, cap лояльності.

**Spec:** [promt.md](../../../promt.md)
