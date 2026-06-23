# F23 — Academic Mermaid diagrams

## Related Execution Order step(s)

- **Step 16** — [promt.md](../../../promt.md) **Academic Deliverables — Mermaid Diagrams** (також згадано «у `/docs/`»)

## Status

`Done` (чернетки в `docs/diagrams/`, синхронізувати з фінальним кодом перед захистом)

## Spec source

- [promt.md](../../../promt.md) — файли в **`/docs/diagrams/`** (use-case, erd, class-diagram, sequence-booking, sequence-auth, component)

## Acceptance checklist

- [x] `docs/diagrams/use-case.md` — 4 актори (Guest, Receptionist, Manager, Admin), прецеденти згруповані.
- [x] `docs/diagrams/erd.md` — **11 таблиць** з promt, FK, кратність.
- [x] `docs/diagrams/class-diagram.md` — сутності + інтерфейси сервісів + контролери.
- [x] `docs/diagrams/sequence-booking.md` — сценарій: створення бронювання → DynamicPricing → save → pay → MockGateway → статуси → лояльність.
- [x] `docs/diagrams/sequence-auth.md` — login → JWT → 401 → refresh → retry → success.
- [x] `docs/diagrams/component.md` — React SPA ↔ Spring Boot ↔ PostgreSQL; Flyway, JWT filter.
- [x] Діаграми у **Mermaid** синтаксисі, валідний рендер у GitHub/Cursor.

## Dependencies

- Логічно після стабілізації моделі (F02–F17); можна чернетки раніше й оновлювати.

## Legacy (coursework) note

Курсова могла містити скріншоти без формальних **UML/sequence** — для диплому це обов’язкові артефакти з promt.

## Thesis section hint

Додатки до записки: UML, ER, сценарії взаємодії; перенесення з `docs/diagrams/` у PDF записки.

## Notes / Risks

- Тримати діаграми в синхроні з фінальною реалізацією перед захистом.

**Spec:** [promt.md](../../../promt.md)
