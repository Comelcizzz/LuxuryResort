# F19 — Frontend init (Vite + React + TS strict + Tailwind + shadcn/ui)

## Related Execution Order step(s)

- **Step 10** — [promt.md](../../../promt.md) **Frontend Structure**, **UI Design System**, Tech Stack

## Status

`Done` (кореневий `frontend/`, Radix + CVA замість повного CLI shadcn — токени та патерни з promt)

## Spec source

- [promt.md](../../../promt.md) — React 18, Vite, TypeScript strict (**zero `any`**), Tailwind, shadcn/ui, Radix, структура `src/`

## Acceptance checklist

- [x] Новий фронтенд-проєкт у **`frontend/`** з Vite + React 18.
- [x] `tsconfig` **strict**, ESLint правило проти `any`.
- [x] Tailwind; **Radix** + **class-variance-authority** (патерн shadcn-кнопок/діалогів).
- [x] Дизайн-токени: navy/gold/cream/slate/success/error з promt.
- [x] Типографіка: **Playfair Display** + **Inter** (Google Fonts).
- [x] Структура папок як у promt (`api/`, `components/`, `pages/`, `store/`, `hooks/`, `types/`, `lib/`).

## Dependencies

- [F17](F17-rest-controllers-exceptions.md) — бажано мати OpenAPI / базовий URL API для env (можна паралельно з mock).

## Legacy (coursework) note

Курсова у `legacy/frontend/` — JSX, без TS strict і без shadcn. Дипломний UI — **новий** кореневий `frontend/` за специфікацією.

## Thesis section hint

«Клієнтська частина», вибір стеку, адаптивність, дизайн-система.

## Notes / Risks

- Не копіювати старі компоненти без адаптації під TS і дизайн-токени.

**Spec:** [promt.md](../../../promt.md)
