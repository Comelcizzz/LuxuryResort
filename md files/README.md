# Resort Management System

A full-featured full-stack web application for a resort website with hotel rooms and additional services.

## Features

- 🏨 Browse rooms with filtering and sorting
- 🔍 Search functionality for rooms and services
- 📅 Room booking and management
- 🧖‍♀️ Service booking and management
- ⭐ Leave reviews for rooms
- 👤 User authentication and profile management
- 📱 Fully responsive design
- 🔒 JWT-based authentication

## Tech Stack

### Frontend
- React
- TailwindCSS
- React Router
- Axios
- React Hook Form
- React Icons
- React Hot Toast

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- JWT Authentication
- Bcrypt for password hashing

## Diploma tracking (LuxuryResort)

Переробка курсової в дипломну за специфікацією у корені репозиторію: [promt.md](promt.md). Статуси виконання та чеклісти по кроках: [docs/luxuryresort/ROADMAP.md](docs/luxuryresort/ROADMAP.md) та [docs/luxuryresort/features/README.md](docs/luxuryresort/features/README.md).

### Швидкий старт (дипломний API + БД)

**Docker не обов’язковий.** Нижче спочатку варіант з Compose; альтернатива без жодного Docker — у підрозділі **«Без Docker: PostgreSQL + Spring + Vite»** нижче в цьому README.

1. **Docker** установлений, порти `5432` / `8080` вільні.
2. З кореня репозиторію: `npm run db:up` — піднімається лише **PostgreSQL** (`resort_user` / `resort_pass`, БД `luxuryresort`).
3. Скопіюйте [backend/.env.example](backend/.env.example) → `backend/.env` і виставте `DATABASE_USERNAME=resort_user`, `DATABASE_PASSWORD=resort_pass` (як у Compose).
4. У каталозі `backend/`: `.\mvnw.cmd spring-boot:run` (Windows) або `./mvnw spring-boot:run`. Swagger: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html).

**Усе в одному Docker (API + Postgres):** скопіюйте [.env.example](.env.example) → `.env`, задайте `JWT_SECRET` (мінімум **32 символи** для HMAC JWT; згенерувати, наприклад: `openssl rand -base64 48`), потім `npm run docker:app`.

### Без Docker: PostgreSQL + Spring + Vite

Потрібні лише **JDK 21**, **Node.js**, **PostgreSQL 16+** (локально або в хмарі) і вільні порти **5432** (або інший — тоді змініть `DATABASE_URL`) та **8080**.

**A. Локально встановлений PostgreSQL (Windows / macOS / Linux)**  
1. Встановіть PostgreSQL (наприклад [postgresql.org/download](https://www.postgresql.org/download/) або `winget install PostgreSQL.PostgreSQL.16`).  
2. Створіть базу `luxuryresort`. Найпростіше для розробки: увійти під користувачем `postgres`, у `psql` виконати `CREATE DATABASE luxuryresort;` і в [backend/.env](backend/.env.example) залишити типові `DATABASE_USERNAME=postgres`, `DATABASE_PASSWORD=…` та   `DATABASE_URL=jdbc:postgresql://localhost:5432/luxuryresort`.  
   Альтернатива — окремий користувач `resort_user` / `resort_pass` з правами на цю БД (як у прикладі для Docker).  
3. З каталогу `backend/`: `.\mvnw.cmd spring-boot:run` — Flyway у профілі `dev` застосує міграції та dev-дані.  
4. Фронт: з кореня `npm run dev:diploma-frontend`.

**B. Хмарна PostgreSQL (Neon, Supabase, Railway, Aiven тощо)**  
1. Створіть інстанс і візьміть host, порт, ім’я БД, логін і пароль.  
2. У `backend/.env` задайте, наприклад:  
   `DATABASE_URL=jdbc:postgresql://HOST:5432/DBNAME?sslmode=require`  
   (якщо провайдер вимагає SSL — часто обов’язково; див. їхню документацію).  
3. Увімкніть доступ з вашої IP або «дізнайтесь IP хмари», якщо Spring крутиться локально.  
4. Запустіть Spring і Vite так само, як у пункті A — **жодного Docker на вашому ПК не потрібно**.

**C. PostgreSQL у WSL2 (без Docker Desktop)**  
У Linux-дистрибутиві WSL: `sudo apt install postgresql` (або аналог), створіть БД `luxuryresort`, у `DATABASE_URL` вкажіть хост WSL (з Windows це зазвичай IP інстансу WSL або `localhost`, якщо порт проброшено). Деталі залежать від вашої мережевої схеми WSL2.

**Фронт диплому:** опційно [frontend/.env.example](frontend/.env.example) → `frontend/.env` (лише якщо потрібен нестандартний `VITE_API_BASE`; за замовчуванням Vite проксує `/api` на `localhost:8080`). Тести клієнта: `npm run test:diploma-frontend`. У [frontend/vite.config.ts](frontend/vite.config.ts) корінь проєкту нормалізується через `fs.realpathSync.native`, щоб не змішувати короткий шлях Windows (`9ED2~1`) з повним шляхом з кирилицею — інакше Vite може видавати «Does the file exist?» для `/src/main.tsx` або падати збірка в Rollup.

Деплой на dev/staging (образ, змінні середовища, хмари): [docs/DEPLOY_DEV.md](docs/DEPLOY_DEV.md).

### Дипломний backend (Spring Boot)

- Каталог **`backend/`** — Java 21, Spring Boot 3.4, PostgreSQL, Flyway, Maven Wrapper (`mvnw.cmd` / `mvnw`).
- Скопіюйте [backend/.env.example](backend/.env.example) у `backend/.env` (не комітити) або експортуйте змінні `DATABASE_*`, `JAVA_HOME`.
- Збірка: з каталогу `backend/` виконайте `.\mvnw.cmd package -DskipTests` (Windows) або `./mvnw package -DskipTests`. Рекомендовано **JDK 21** (Temurin 21). Annotation processors Lombok/MapStruct увімкнені в `pom.xml` (див. [docs/luxuryresort/features/F01-backend-bootstrap.md](docs/luxuryresort/features/F01-backend-bootstrap.md)); на JDK 24+ при збоях компілятора використовуйте саме JDK 21.
- Якщо `mvnw` падає з `MavenWrapperMain` на шляхах з не-ASCII (кирилиця в імені папки), зберіть проєкт з ASCII-шляху або з IntelliJ IDEA з вказаним `JAVA_HOME`.
- Якщо при `mvnw spring-boot:run` компілятор падає з **`TypeTag :: UNKNOWN`** / `ExceptionInInitializerError`: встановіть **JDK 21** (Temurin 21), виставте `JAVA_HOME` на цей JDK і перевірте `java -version` у тому ж терміналі. У проєкті також піднято **Lombok 1.18.38** у `pom.xml` для кращої сумісності з новішими JDK; для диплому все одно рекомендується саме **21**.
- **Не запускайте API на JDK 25:** після збірки Spring може впасти з **`NoClassDefFoundError: List`** (рефлексія Spring Data + JDK 25). У `backend/pom.xml` увімкнено **Maven Enforcer**: Maven приймає лише **JDK 21** (`[21,22)`).
- **Windows — як увімкнути JDK 21:** (1) Встановіть [Temurin 21](https://adoptium.net/temurin/releases/?version=21) (x64, MSI). (2) У **новому** CMD перевірте: `where java` — першим рядком має бути `...\jdk-21...\bin\java.exe`. Якщо все ще 25 — тимчасово в цьому вікні: `set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-21.0.xx.x-hotspot"` (папку візьміть з Провідника в `C:\Program Files\Eclipse Adoptium\`) і `set "PATH=%JAVA_HOME%\bin;%PATH%"`, потім `java -version` має показати **21**. Назавжди: **Параметри → Система → Про програму → Додаткові параметри системи → Змінні середовища** — змініть **`JAVA_HOME`** на папку `jdk-21...`, у **`Path`** поставте **`%JAVA_HOME%\bin` вище** за шляхи до інших Java. (3) Або без ручного PATH: з кореня репо запустіть [scripts/windows/spring-boot-run-jdk21.cmd](scripts/windows/spring-boot-run-jdk21.cmd) — скрипт сам знайде `jdk-21*` у `Program Files` або використає вже правильний `JAVA_HOME`.

### Курсова MERN (legacy)

- **`legacy/backend/`** — Express, MongoDB, JWT. **`legacy/frontend/`** — React + Vite.
- Кореневі npm-скрипти `npm run dev`, `npm run install-all` залишені для **legacy** (див. [package.json](package.json)).

## Project Structure

```
/
├── backend/                    # Diploma: Spring Boot + Flyway (PostgreSQL)
│   ├── pom.xml
│   ├── mvnw / mvnw.cmd
│   └── src/main/java/com/luxuryresort/ …
├── legacy/
│   ├── backend/                # Coursework: Express + MongoDB
│   └── frontend/               # Coursework: React + Vite
├── docker-compose.yml          # Postgres (+ backend з profile `app`)
├── .env.example                # JWT_SECRET, CORS (Compose / docker:app)
├── frontend/.env.example       # Опційні змінні Vite (VITE_API_BASE)
├── docs/luxuryresort/          # Roadmap + feature checklists
├── docs/DEPLOY_DEV.md          # Як зібрати образ і задеплоїти на dev
├── promt.md                    # Diploma specification
└── package.json                # Root scripts (legacy dev + install + db:up)
```

## Installation

### Prerequisites

- **Legacy MERN:** Node.js, MongoDB.
- **Diploma backend:** JDK 21+ (21 recommended), PostgreSQL 16+, Maven optional (wrapper included).

### Setup — coursework (legacy)

1. Clone the repository.
2. Install legacy dependencies from repo root: `npm run install-legacy` (or `npm run install-all`).
3. Create `.env` in `legacy/backend` and `legacy/frontend` from their `.env.example` files where applicable.

4. **Optional — demo data (MongoDB)**  
   From `legacy/backend/`: `npm run seed` adds sample rooms (`LR-*`), services, reviews with **real image URLs** (Unsplash), and demo users `luxresseed0@gmail.com` … `luxresseed9@gmail.com` (password `Passw0rd!`).  
   **`npm run seed:reset`** clears seed users, their bookings/reviews, all `LR-*` rooms, and **all** services, then re-seeds — use only on a dev database.

### Setup — diploma Spring API

1. Install PostgreSQL and create database `luxuryresort` (or set `DATABASE_URL`).
2. Copy `backend/.env.example` to `backend/.env` and adjust credentials.
3. From `backend/`: run `.\mvnw.cmd spring-boot:run` (Windows). With profile `dev`, Flyway applies `db/migration` + `db/dev` (demo users `admin@luxuryresort.local`, `manager@…`, `reception@…`, `guest@…`, password **`Passw0rd!`**).

## Admin Access

The system has two administrative roles:

1. **Admin**: Full access to all administrative features
   - Can create, update, and delete rooms and services
   - Can manage bookings and service orders
   - Can manage users

2. **Staff**: Limited administrative access
   - Can update rooms and services (but cannot create or delete them)
   - Can manage bookings and service orders

The system automatically assigns roles in the following cases:
- The first registered user automatically becomes an admin
- Any user with an email ending with "@admin.com" is automatically assigned admin privileges
- Any user with an email ending with "@staff.com" is automatically assigned staff privileges

To access the admin dashboard, users with admin or staff roles can click on "Admin Dashboard" in their profile dropdown menu.

## Running the Application

### Development Mode — legacy MERN

1. Backend: `cd legacy/backend` then `npm run dev`.
2. Frontend: `cd legacy/frontend` then `npm run dev`.

Or from repository root: `npm run dev` / `npm run dev:legacy`.

### Development Mode — diploma Spring

1. Start PostgreSQL.
2. `cd backend` then `.\mvnw.cmd spring-boot:run` (ensure `SPRING_PROFILES_ACTIVE=dev` or use defaults in `application.yml`).

### Production Mode — legacy

1. `cd legacy/frontend` → `npm run build`
2. `cd legacy/backend` → `npm start`

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/updatedetails` - Update user details

### Room Endpoints
- `GET /api/rooms` - Get all rooms (with filtering & pagination)
- `GET /api/rooms/:id` - Get single room
- `POST /api/rooms` - Create new room (admin)
- `PUT /api/rooms/:id` - Update room (admin)
- `DELETE /api/rooms/:id` - Delete room (admin)

### Booking Endpoints
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/:id` - Get single booking
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id` - Update booking status
- `DELETE /api/bookings/:id` - Delete booking

### Service Endpoints
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get single service
- `POST /api/services` - Create new service (admin)
- `PUT /api/services/:id` - Update service (admin)
- `DELETE /api/services/:id` - Delete service (admin)

### Service Order Endpoints
- `GET /api/service-orders` - Get all service orders
- `GET /api/service-orders/:id` - Get single service order
- `POST /api/service-orders` - Create service order
- `PUT /api/service-orders/:id` - Update service order status
- `DELETE /api/service-orders/:id` - Delete service order

### Review Endpoints
- `GET /api/reviews` - Get all reviews
- `GET /api/reviews/:id` - Get single review
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### List Query Conventions
- Pagination (all list endpoints): `page`, `size`, `sort` (e.g. `sort=createdAt,desc`).
- Text search param: `q` (where supported by endpoint).
- `GET /api/rooms`: `q`, `type`, `priceMin`, `priceMax`, `maxOccupancy`, `available`.
- `GET /api/services`: `q`, `category`, `available`, `priceMin`, `priceMax`, `durationMin`, `durationMax`.
- `GET /api/reviews`: `roomId`, `approved`, `q`, `ratingMin`, `ratingMax`, `from`, `to`.
- `GET /api/bookings`: `status`, `q`, `from`, `to` (scope depends on role).
- `GET /api/service-orders`: `status`, `q`, `from`, `to` (scope depends on role).
- `GET /api/admin/users`: `q`, `role`, `active`.
- `GET /api/admin/audit-logs`: `entityType`, `action`, `from`, `to`.
- `GET /api/admin/pricing-rules`: `q`, `ruleType`, `active`, plus paging/sort.

## Deployment

The application can be deployed on various platforms:

- Frontend: Vercel, Netlify, or any static hosting
- Backend: Render, Railway, Heroku
- Database: MongoDB Atlas

## License

[MIT](LICENSE) 