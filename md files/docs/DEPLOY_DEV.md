# Deploy LuxuryResort API (dev / staging)

## Docker image

From repository root:

```bash
docker build -t luxury-resort-api:dev ./backend
```

The image runs a single JAR on port `8080` (Temurin 21 JRE).

## Required environment (any host)

| Variable | Example | Notes |
|----------|---------|--------|
| `SPRING_PROFILES_ACTIVE` | `docker` or `prod` | `docker` includes Flyway dev seed; `prod` only base migrations. |
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://host:5432/luxuryresort` | JDBC URL to PostgreSQL 16+. |
| `SPRING_DATASOURCE_USERNAME` | `resort_user` | |
| `SPRING_DATASOURCE_PASSWORD` | `***` | |
| `CORS_ORIGINS` | `https://your-frontend.dev` | Comma-separated list; must match browser origin when using credentials. |
| `JWT_SECRET` | 32+ random chars | Used once JWT auth is enabled (F06). |

## Compose on a VM (full stack)

1. Copy [`.env.example`](../.env.example) to `.env` and set `JWT_SECRET`, optionally `CORS_ORIGINS`.
2. Run:

```bash
docker compose --profile app up -d --build
```

3. API: `http://<host>:8080`, Swagger UI: `http://<host>:8080/swagger-ui.html` (profile `docker`).

## Render (рекомендовано — Blueprint)

У корені репозиторію є [`render.yaml`](../../render.yaml): PostgreSQL + API (Docker) + фронт (Static Site).

### Кроки

1. Завантажте проєкт на **GitHub** (репозиторій має бути під git; `.env` не комітити).
2. [render.com](https://render.com) → **New** → **Blueprint** → оберіть репозиторій.
3. Render створить три ресурси: `luxuryresort-db`, `luxuryresort-api`, `luxuryresort-web`.
4. Дочекайтеся зеленого деплою API (Flyway накатить схему). Потім перезапустіть фронт, якщо збірка була раніше API.
5. Відкрийте URL static site (`luxuryresort-web.onrender.com`).

### Що налаштовується автоматично

| Змінна | Джерело |
|--------|---------|
| `DATABASE_URL` → JDBC | entrypoint у `backend/docker-entrypoint.sh` |
| `PORT` | Render → Spring `server.port` |
| `JWT_SECRET` | генерується Render |
| `CORS_ORIGINS` | URL фронтенду |
| `VITE_API_BASE` | URL API + `/api` (скрипт `frontend/scripts/render-build.mjs`) |

### Демо-дані на Render

За замовчуванням `SPRING_PROFILES_ACTIVE=prod` (без seed). Для тестових користувачів з `db/dev` у Dashboard API змініть на `docker` і зробіть **Manual Deploy**.

### Перевірка

- API: `GET https://<api-host>/actuator/health` → `{"status":"UP"}`
- Swagger (лише профіль `docker`): `/swagger-ui.html`

### Free tier

Web-сервіси «засинають» після бездіяльності (холодний старт ~30–60 с). Безкоштовна БД Render має обмеження — для диплому достатньо.

## Інші платформи (Railway, Fly.io)

1. Provision **PostgreSQL 16** and note connection URL.
2. Deploy from this repo using **Dockerfile** in `backend/` (root context path should be `backend` or use subdirectory build setting).
3. Set the environment variables above in the platform UI.
4. Health check: `GET /actuator/health` (Spring Boot Actuator увімкнено в проєкті).

## Database only (local or remote)

```bash
docker compose up -d postgres
```

Then run Spring locally with `DATABASE_URL` pointing at that instance (see [README](../README.md)).
