# F16 — InvoiceService + LoyaltyService + AuditService

## Related Execution Order step(s)

- **Step 7** (фінальні три сервіси в ланцюжку promt: … **Invoice → Loyalty → Audit**)

## Status

`Not started`

## Spec source

- [promt.md](../../../promt.md) — **PDF Invoice (iTextPDF 7)**, **Loyalty Points System**, audit через `audit_logs` + package `infrastructure/audit/`, AuditEntityListener

## Acceptance checklist — Invoice

- [ ] `InvoiceService.generateInvoice(bookingId)` → `byte[]` `application/pdf`.
- [ ] Макет: header курорту, метадані, гість, таблиця номера/дат/ночей/ціни, **розбір динамічного ціноутворення** (правила, лояльність, фінал), таблиця замовлень послуг, блок оплати, footer.
- [ ] iText: `PdfPTable`, чергування заливки рядків, заголовки кольором `#C9A96E`.
- [ ] `GET /api/bookings/{id}/invoice`

## Acceptance checklist — Loyalty

- [ ] Нарахування: 1 бал на 100 UAH — **узгоджено з F10/F11:** на гаманець користувача бали за бронь нараховуються лише при переході в **`CHECKED_OUT`** (поле `loyalty_points_earned` на броні виставляється при створенні з F09); успішна оплата (F11) бали на акаунт не додає.
- [ ] Списання при бронюванні: 100 балів = 1%, max 15% (1500 балів).
- [ ] `GET /api/loyalty/balance` → `{ points, equivalentDiscount }`
- [ ] Зміни `users.loyalty_points` + запис у **audit_logs** (як у promt).

## Acceptance checklist — Audit

- [ ] `AuditEntityListener`, `AuditContext` (IP, user).
- [ ] `GET /api/admin/audit-logs` — пагінація, фільтри entityType, action, from, to — **ADMIN** лише перегляд audit за матрицею? Promt: View audit logs — ADMIN only. Yes.
- [ ] Логування CREATE/UPDATE/DELETE/STATUS_CHANGE з old/new JSON.

## Dependencies

- [F10](F10-service-bookings.md), [F11](F11-service-payments.md), [F12](F12-service-service-orders.md), [F09](F09-service-dynamic-pricing.md) для snapshot у PDF

## Legacy (coursework) note

Курсова: без PDF-рахунків, без формальної лояльності, без **audit trail** на рівні сутностей.

## Thesis section hint

«Формування рахунку», «Програма лояльності», «Журналювання змін» — можна три підрозділи в одному розділі реалізації.

## Notes / Risks

- iText 7 API vs застарілий `PdfPTable` у тексті promt — використати актуальний API iText 7 з еквівалентною версткою.
- Три підсистеми в одному F-файлі для трекінгу; за потреби розщепити на F16a/F16b/F16c пізніше без зміни Execution Order.

**Spec:** [promt.md](../../../promt.md)
