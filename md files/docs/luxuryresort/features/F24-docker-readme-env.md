# F24 — Docker Compose + .env.example + README

## Related Execution Order step(s)

- **Step 17** — [promt.md](../../../promt.md) **Docker Setup**, `.env.example`, README

## Status

`Done`

## Spec source

- [promt.md](../../../promt.md) — `docker-compose.yml` з `postgres:16` і `backend` build; змінні `JWT_SECRET`, `CORS_ORIGINS`

## Acceptance checklist

- [x] Кореневий `docker-compose.yml`: БД `luxuryresort`, `resort_user` / `resort_pass`, volume `pgdata`, healthcheck Postgres.
- [x] Сервіс `backend` (profile `app`): build `./backend`, env datasource, порт 8080, `depends_on` + healthcheck, `CORS_ORIGINS` за замовчуванням `http://localhost:5173`.
- [x] **Два** `.env.example`: корінь (Compose / JWT) та `backend/.env.example` (Spring); **`frontend/.env.example`** — `VITE_API_BASE` (опційно).
- [x] `README.md`: Docker (`npm run db:up`, `npm run docker:app`), локальний Spring + Vite, посилання на `docs/DEPLOY_DEV.md`, генерація `JWT_SECRET`.
- [x] Документовано мінімальну довжину `JWT_SECRET` (≥32 символів для стійкого HMAC).

## Dependencies

- [F01](F01-backend-bootstrap.md) — Dockerfile у `./backend`.

## Legacy (coursework) note

Курсова: Node + MongoDB Atlas; диплом: **локальний PostgreSQL у Compose** + JVM backend.

## Thesis section hint

«Розгортання системи», інструкція експлуатації; відповідає вимогам до додатків у записку.

## Notes / Risks

- На Windows перевірити volume paths і line endings для shell у Dockerfile.

**Spec:** [promt.md](../../../promt.md)
