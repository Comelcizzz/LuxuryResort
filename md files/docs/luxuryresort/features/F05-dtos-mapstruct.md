# F05 — DTOs + MapStruct mappers

## Related Execution Order step(s)

- **Step 5** — [promt.md](../../../promt.md) (`application/dto`, `application/mapper`)

## Status

`Done` — DTO + mappers у репозиторії; після першого успішного `mvn -q compile` у `backend/` (на Windows з не-ASCII шляхом до проєкту може знадобитися копія в ASCII-каталозі) зафіксуй у чаті/коміті, що MapStruct-генерація пройшла без помилок.

## Spec source

- [promt.md](../../../promt.md) — REST API тіла відповідей/запитів; `PricingResult`, `RecommendedServiceDTO`, `OccupancyForecastDTO`, `ApiResponse` envelope

## Acceptance checklist

- [x] Request DTO: реєстрація, логін, refresh, створення бронювання (roomId, checkIn, checkOut, guests, loyaltyPointsToUse, specialRequests), pay, статус бронювання, відгук, service order, CRUD room/service, pricing rules, admin role change.
- [x] Response DTO: `UserResponse`, `PageResponse<T>` для пагінації (rooms, bookings, audit, users — у F17).
- [x] `PricingResult` / `AppliedRuleDto` для відповіді POST bookings та invoice; у `BookingMapper` поле `pricing` заповнюється через `toResponse(booking, pricing)` після сервісу.
- [x] MapStruct: mapper на кожну основну сутність (`User`, `Room`, `Booking`, `Payment`, `ServiceEntity`, `ServiceOrder`, `Review`, `PricingRule`, `AuditLog`). `RefreshToken` без публічного response — mapper не додано.
- [x] Глобальний тип **ApiResponse&lt;T&gt;** у `com.luxuryresort.web.dto` (обгортка для F17; promt також згадує `web/advice`).

## Dependencies

- [F03](F03-jpa-entities.md), [F04](F04-jpa-repositories.md)

## Legacy (coursework) note

Раніше JSON «як є» з Mongoose. Диплом: **жорстка контрактна модель** DTO + мапери.

## Thesis section hint

«Проєктування інтерфейсу взаємодії», формати запитів/відповідей API.

## Notes / Risks

- BigDecimal / money поля: мапінг scale 2, узгодити з DECIMAL у БД.
- Не експонувати `password_hash` у жодному response DTO.

**Spec:** [promt.md](../../../promt.md)
