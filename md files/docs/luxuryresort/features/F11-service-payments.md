# F11 — PaymentService + MockPaymentGateway

## Related Execution Order step(s)

- **Step 7** (п’ятий сервіс) — [promt.md](../../../promt.md) **Mock Payment Gateway**, REST `POST .../pay`

## Status

`Done`

## Spec source

- [promt.md](../../../promt.md) — `PaymentGateway` / `MockPaymentGateway` pseudocode; поведінка success/failure; оновлення `booking.status` та `payment.status`

## Acceptance checklist

- [x] `POST /api/bookings/{id}/pay` + `PayBookingRequest` → `MockPaymentGateway`.
- [x] `MockPaymentGateway`: `Thread.sleep(800)`, ~90% success, ref `TXN-` + 8 hex, failure `Insufficient funds — simulated`.
- [x] **Success:** `booking.status = CONFIRMED`, `payment.status = COMPLETED`, `processed_at`.
- [x] **Failure:** бронь лишається `PENDING`, `payment.status = FAILED`, `failure_reason`; **422** + `ApiResponse` + `errors.paymentId`.
- [x] Рядок `payments`: amount = `dynamic_price_total`, UAH, method, ref / failure.
- [x] **Лояльність:** одна узгоджена модель з F10 — **нарахування `loyalty_points_earned` на гаманець лише при `CHECKED_OUT`**; при успішній оплаті бали на акаунт **не** додаються (щоб не дублювати з promt § Mock Payment «credited» vs § Loyalty earn on checkout). Детальніше — [F16](F16-service-invoice-loyalty-audit.md).

## Dependencies

- [F10](F10-service-bookings.md)
- [F16](F16-service-invoice-loyalty-audit.md) частково для лояльності

## Legacy (coursework) note

У **поточному MERN** додано: `POST /api/bookings/:id/mock-pay`, сторінка `/bookings/:id/mock-pay` (мок-еквайринг LuxuryPay), поля `isPaid` / `paymentRef` у MongoDB. Це **не** те саме, що майбутній Spring `MockPaymentGateway`, але поведінка схожа (затримка, ~90% успіх). Для диплому за `promt.md` логіку перенести в Java-сервіс і окремі `payments`.

## Thesis section hint

«Модель оплати», інтеграційний шар, сценарії успіху/відмови (без реального PSP).

## Notes / Risks

- Не блокувати event loop у Node було важливо; у Java `Thread.sleep` у gateway — прийнятно для mock, але для prod замінити на async або зовнішній виклик.

**Spec:** [promt.md](../../../promt.md)
