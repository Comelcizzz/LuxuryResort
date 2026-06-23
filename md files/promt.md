# LuxuryResort — Enterprise Diploma Thesis Specification

## Project Goal
Rebuild an existing MERN coursework (MongoDB + Express + React: Rooms, Bookings, Services, ServiceOrders, Reviews, JWT Auth) into a full enterprise-grade Bachelor's Diploma system for Ukrainian CS specialty 122. Rebuild everything from scratch. Keep the same domain (resort hotel), massively expand business logic.

---

## Tech Stack (non-negotiable)

Backend: Java 21 + Spring Boot 3.x + Spring Security (JWT RBAC) + PostgreSQL + Hibernate JPA + Flyway + MapStruct + Lombok + springdoc-openapi + iTextPDF 7 + Maven

Frontend: React 18 + Vite + TypeScript strict (zero `any`) + Tailwind CSS + shadcn/ui + Radix UI + Zustand + TanStack Query v5 + React Hook Form + Zod + Axios + Framer Motion + Recharts

Testing: JUnit 5 + Mockito + Testcontainers + Vitest + React Testing Library

---

## Database Schema — All Flyway Migrations

### V1__init.sql
````sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE TYPE user_role AS ENUM ('ADMIN','MANAGER','RECEPTIONIST','GUEST');
CREATE TYPE room_type AS ENUM ('STANDARD','DELUXE','SUITE','PRESIDENTIAL');
CREATE TYPE room_status AS ENUM ('AVAILABLE','OCCUPIED','MAINTENANCE','RESERVED');
CREATE TYPE booking_status AS ENUM ('PENDING','CONFIRMED','CHECKED_IN','CHECKED_OUT','CANCELLED','NO_SHOW');
CREATE TYPE payment_status AS ENUM ('PENDING','PROCESSING','COMPLETED','FAILED','REFUNDED');
CREATE TYPE service_category AS ENUM ('SPA','FITNESS','DINING','EXCURSION','TRANSFER','OTHER');
CREATE TYPE order_status AS ENUM ('PENDING','CONFIRMED','IN_PROGRESS','COMPLETED','CANCELLED');
CREATE TYPE audit_action AS ENUM ('CREATE','UPDATE','DELETE','STATUS_CHANGE');
CREATE TYPE rule_type AS ENUM ('SEASONAL','WEEKEND_SURGE','LONG_STAY_DISCOUNT','EARLY_BIRD','LAST_MINUTE');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'GUEST',
    is_active BOOLEAN NOT NULL DEFAULT true,
    loyalty_points INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    base_price_per_night DECIMAL(10,2) NOT NULL,
    room_type room_type NOT NULL,
    max_occupancy INT NOT NULL,
    size_sqm DECIMAL(6,2),
    floor INT,
    room_number VARCHAR(10) UNIQUE NOT NULL,
    status room_status NOT NULL DEFAULT 'AVAILABLE',
    amenities JSONB NOT NULL DEFAULT '[]',
    images JSONB NOT NULL DEFAULT '[]',
    avg_rating DECIMAL(3,2) NOT NULL DEFAULT 0,
    review_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP
);

CREATE TABLE pricing_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    rule_type rule_type NOT NULL,
    multiplier DECIMAL(5,4) NOT NULL,
    start_date DATE,
    end_date DATE,
    min_nights INT,
    days_before_checkin INT,
    priority INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID NOT NULL REFERENCES rooms(id),
    user_id UUID NOT NULL REFERENCES users(id),
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    guests_count INT NOT NULL,
    base_total DECIMAL(10,2) NOT NULL,
    dynamic_price_total DECIMAL(10,2) NOT NULL,
    final_multiplier DECIMAL(5,4) NOT NULL DEFAULT 1.0,
    pricing_snapshot JSONB NOT NULL DEFAULT '{}',
    status booking_status NOT NULL DEFAULT 'PENDING',
    cancellation_reason TEXT,
    special_requests TEXT,
    loyalty_points_earned INT NOT NULL DEFAULT 0,
    loyalty_points_used INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT no_overlap EXCLUDE USING gist (
        room_id WITH =,
        daterange(check_in_date, check_out_date) WITH &&
    ) WHERE (status NOT IN ('CANCELLED','NO_SHOW'))
);

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'UAH',
    status payment_status NOT NULL DEFAULT 'PENDING',
    payment_method VARCHAR(50),
    transaction_ref VARCHAR(255),
    failure_reason TEXT,
    processed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category service_category NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    duration_minutes INT,
    max_participants INT NOT NULL DEFAULT 1,
    images JSONB NOT NULL DEFAULT '[]',
    is_available BOOLEAN NOT NULL DEFAULT true,
    popularity_score DECIMAL(8,4) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP
);

CREATE TABLE service_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID NOT NULL REFERENCES services(id),
    user_id UUID NOT NULL REFERENCES users(id),
    booking_id UUID REFERENCES bookings(id),
    appointment_datetime TIMESTAMP NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    total_price DECIMAL(10,2) NOT NULL,
    status order_status NOT NULL DEFAULT 'PENDING',
    special_requests TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID NOT NULL REFERENCES rooms(id),
    user_id UUID NOT NULL REFERENCES users(id),
    booking_id UUID NOT NULL REFERENCES bookings(id),
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    images JSONB NOT NULL DEFAULT '[]',
    sentiment_score DECIMAL(5,4),
    is_approved BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID NOT NULL,
    action audit_action NOT NULL,
    old_value JSONB,
    new_value JSONB,
    performed_by UUID REFERENCES users(id),
    ip_address VARCHAR(45),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    revoked BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bookings_room_dates ON bookings(room_id, check_in_date, check_out_date);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_reviews_room ON reviews(room_id);
````

---

## Algorithm 1 — Dynamic Pricing Engine

Implement `DynamicPricingService` using a **weighted multiplicative pricing model**.

**Mathematical formula:**

````
P_final = P_base × N × ∏(i=1 to k) M_i × (1 - D_loyalty)

Where:
  P_base  = room.basePricePerNight
  N       = number of nights
  M_i     = multiplier of the i-th applicable pricing rule
  k       = count of active rules that match this booking period
  D_loyalty = loyalty discount (loyaltyPointsUsed / 10000, max 0.15)
````

**Weekend surge sub-formula:**
````
weekendNights = count of Saturdays and Sundays in [checkIn, checkOut)
weekendRatio  = weekendNights / N
M_weekend     = 1.0 + (weekendRatio × (surgeFactor - 1.0))
````

**Java pseudocode for the service:**
````java
PricingResult calculateDynamicPrice(UUID roomId, LocalDate checkIn, LocalDate checkOut, int loyaltyPointsToUse) {
    long nights = ChronoUnit.DAYS.between(checkIn, checkOut);
    BigDecimal basePrice = roomRepository.findById(roomId).basePricePerNight;
    BigDecimal baseTotal = basePrice.multiply(BigDecimal.valueOf(nights));

    List<PricingRule> rules = pricingRuleRepository
        .findActiveRulesForPeriod(checkIn, checkOut)
        .stream()
        .sorted(Comparator.comparingInt(PricingRule::getPriority).reversed())
        .toList();

    BigDecimal combinedMultiplier = BigDecimal.ONE;
    List<AppliedRuleDTO> appliedRules = new ArrayList<>();

    for (PricingRule rule : rules) {
        boolean applies = switch (rule.getRuleType()) {
            case SEASONAL -> overlaps(checkIn, checkOut, rule.getStartDate(), rule.getEndDate());
            case WEEKEND_SURGE -> hasWeekendNights(checkIn, checkOut);
            case LONG_STAY_DISCOUNT -> nights >= rule.getMinNights();
            case EARLY_BIRD -> ChronoUnit.DAYS.between(LocalDate.now(), checkIn) >= rule.getDaysBeforeCheckin();
            case LAST_MINUTE -> ChronoUnit.DAYS.between(LocalDate.now(), checkIn) <= rule.getDaysBeforeCheckin();
        };
        if (applies) {
            combinedMultiplier = combinedMultiplier.multiply(rule.getMultiplier());
            appliedRules.add(new AppliedRuleDTO(rule.getName(), rule.getMultiplier()));
        }
    }

    BigDecimal loyaltyDiscount = BigDecimal.valueOf(Math.min(loyaltyPointsToUse / 10000.0, 0.15));
    BigDecimal finalTotal = baseTotal
        .multiply(combinedMultiplier)
        .multiply(BigDecimal.ONE.subtract(loyaltyDiscount))
        .setScale(2, RoundingMode.HALF_UP);

    int pointsEarned = finalTotal.intValue() / 100; // 1 point per 100 UAH

    return new PricingResult(baseTotal, finalTotal, combinedMultiplier, loyaltyDiscount, appliedRules, pointsEarned);
}
````

Store the full `PricingResult` as JSONB in `bookings.pricing_snapshot` for auditability.

---

## Algorithm 2 — Service Recommendation Engine (Collaborative Filtering)

Implement `RecommendationService` using **item-based collaborative filtering with TF-IDF weighting** on service categories.

**Mathematical model:**

````
relevance(user u, service s) = α × CategoryScore(u, s) + β × GlobalPopularity(s) + γ × RatingScore(s)

Where:
  α = 0.55, β = 0.30, γ = 0.15  (tunable weights, store in config)

CategoryScore(u, s):
  freq(u, c) = count of orders by user u in category c
  total(u)   = total orders by user u
  TF(u, c)   = freq(u, c) / total(u)
  IDF(c)     = log(totalUsers / usersWhoOrderedCategory(c) + 1)
  weight(u, c) = TF(u,c) × IDF(c)
  CategoryScore = weight(u, s.category) / max_weight(u)  ∈ [0,1]

GlobalPopularity(s):
  s.popularity_score is updated nightly:
  popularity(s) = log(1 + orderCount(s, last30days)) / log(1 + maxOrderCount)

RatingScore(s):
  Not yet implemented for services — default to 0.5
````

**Java pseudocode:**
````java
List<RecommendedServiceDTO> getRecommendations(UUID userId, int limit) {
    List<ServiceOrder> history = serviceOrderRepository.findCompletedByUser(userId);

    if (history.isEmpty()) {
        return serviceRepository.findTopByPopularityScore(limit)
            .stream().map(s -> new RecommendedServiceDTO(s, 0.5, "popular")).toList();
    }

    Map<ServiceCategory, Long> categoryFreq = history.stream()
        .collect(Collectors.groupingBy(o -> o.getService().getCategory(), Collectors.counting()));

    long totalOrders = history.size();
    Map<ServiceCategory, Double> tfIdfWeights = new EnumMap<>(ServiceCategory.class);

    for (var entry : categoryFreq.entrySet()) {
        ServiceCategory cat = entry.getKey();
        double tf = (double) entry.getValue() / totalOrders;
        long usersInCat = userRepository.countUsersWhoOrderedCategory(cat);
        long totalUsers = userRepository.count();
        double idf = Math.log((double) (totalUsers + 1) / (usersInCat + 1));
        tfIdfWeights.put(cat, tf * idf);
    }

    double maxWeight = tfIdfWeights.values().stream().mapToDouble(Double::doubleValue).max().orElse(1.0);

    Set<UUID> alreadyOrdered = history.stream()
        .map(o -> o.getService().getId()).collect(Collectors.toSet());

    return serviceRepository.findAllAvailable().stream()
        .filter(s -> !alreadyOrdered.contains(s.getId()))
        .map(s -> {
            double catScore = tfIdfWeights.getOrDefault(s.getCategory(), 0.0) / maxWeight;
            double popScore = s.getPopularityScore().doubleValue();
            double relevance = 0.55 * catScore + 0.30 * popScore + 0.15 * 0.5;
            return new RecommendedServiceDTO(s, relevance, "personalized");
        })
        .sorted(Comparator.comparingDouble(RecommendedServiceDTO::getRelevanceScore).reversed())
        .limit(limit)
        .toList();
}
````

---

## Algorithm 3 — Occupancy Forecasting (Exponential Smoothing)

Implement `OccupancyForecastService` using **Holt-Winters simple exponential smoothing** to predict room occupancy for the next 30 days. Used in the Admin Dashboard.

**Formula:**
````
S_t = α × X_t + (1 - α) × S_{t-1}

Where:
  X_t   = actual occupancy rate on day t (bookings / total rooms)
  S_t   = smoothed forecast for day t+1
  α     = 0.3 (smoothing factor — lower = smoother, higher = reactive)

For display, compute 7-day rolling forecast:
  forecast[t+1..t+7] = S_t (flat projection from last smoothed value)
````

**Java implementation in `OccupancyForecastService`:**
````java
List<OccupancyForecastDTO> forecastNext30Days() {
    int totalRooms = (int) roomRepository.count();
    LocalDate today = LocalDate.now();
    LocalDate historyStart = today.minusDays(60);

    List<DailyOccupancyProjection> history =
        bookingRepository.getDailyOccupancyBetween(historyStart, today);

    double alpha = 0.3;
    double smoothed = history.isEmpty() ? 0.5 :
        history.get(0).getBookedCount() / (double) totalRooms;

    for (DailyOccupancyProjection point : history) {
        double actual = point.getBookedCount() / (double) totalRooms;
        smoothed = alpha * actual + (1 - alpha) * smoothed;
    }

    List<OccupancyForecastDTO> forecast = new ArrayList<>();
    double projectedSmoothed = smoothed;

    for (int i = 1; i <= 30; i++) {
        LocalDate forecastDate = today.plusDays(i);
        // Apply known pricing rule multipliers as adjustment factor
        double pricingFactor = getPricingPressureForDate(forecastDate); // 0..1
        double adjustedForecast = Math.min(projectedSmoothed * (1 + 0.1 * pricingFactor), 1.0);
        forecast.add(new OccupancyForecastDTO(forecastDate, adjustedForecast));
    }
    return forecast;
}
````

Expose via `GET /api/admin/analytics/forecast` — returns array of `{date, predictedOccupancyRate}`.

---

## Algorithm 4 — Review Sentiment Scoring

Implement `SentimentAnalysisService` that computes a basic **lexicon-based sentiment score** for each review comment when saved.

**Formula:**
````
sentiment(text) = (positiveHits - negativeHits) / totalWords  ∈ [-1.0, 1.0]
normalized = (sentiment + 1) / 2  ∈ [0.0, 1.0]
````

Use a hardcoded Ukrainian + English lexicon (Map<String, Integer> where value is +1 or -1). Store `normalized` in `reviews.sentiment_score`. Display average sentiment trend per room on the admin analytics page.

---

## Backend Package Structure

````
com.luxuryresort
├── config/
│   ├── SecurityConfig.java
│   ├── JwtConfig.java
│   ├── OpenApiConfig.java
│   └── AuditConfig.java
├── domain/
│   ├── entity/          — JPA entities (User, Room, Booking, Payment, Service, ServiceOrder, Review, PricingRule, AuditLog, RefreshToken)
│   ├── enums/           — all enums mirror SQL types
│   └── repository/      — Spring Data JPA repos
├── application/
│   ├── dto/request/     — CreateBookingRequest, RegisterRequest, etc.
│   ├── dto/response/    — BookingResponse, PricingResult, RecommendedServiceDTO, etc.
│   ├── mapper/          — MapStruct mappers (one per entity)
│   └── service/         — interfaces + impl/ subfolder
│       ├── AuthService, RoomService, BookingService, PaymentService
│       ├── ServiceOrderService, ReviewService, AuditService
│       ├── DynamicPricingService, RecommendationService
│       ├── OccupancyForecastService, SentimentAnalysisService
│       └── InvoiceService, LoyaltyService
├── infrastructure/
│   ├── security/        — JwtAuthFilter, JwtService, CustomUserDetailsService
│   ├── audit/           — AuditEntityListener (@EntityListeners), AuditContext
│   └── payment/         — PaymentGateway interface, MockPaymentGateway impl
└── web/
    ├── controller/      — one controller per domain
    └── advice/          — GlobalExceptionHandler, ApiResponse<T> wrapper
````

---

## RBAC Matrix

| Operation | GUEST | RECEPTIONIST | MANAGER | ADMIN |
|---|---|---|---|---|
| View rooms/services | ✓ | ✓ | ✓ | ✓ |
| Create booking + pay | ✓ | ✓ | ✓ | ✓ |
| Cancel own booking | ✓ | ✓ | ✓ | ✓ |
| Check-in / Check-out guest | ✗ | ✓ | ✓ | ✓ |
| Create/edit rooms & services | ✗ | ✗ | ✓ | ✓ |
| Manage pricing rules | ✗ | ✗ | ✓ | ✓ |
| View all bookings | ✗ | ✓ | ✓ | ✓ |
| Approve reviews | ✗ | ✗ | ✓ | ✓ |
| View analytics + forecast | ✗ | ✗ | ✓ | ✓ |
| View audit logs | ✗ | ✗ | ✗ | ✓ |
| Delete rooms/users | ✗ | ✗ | ✗ | ✓ |

---

## REST API

### Auth
````
POST /api/auth/register          → {accessToken, refreshToken, user}
POST /api/auth/login             → {accessToken, refreshToken, user}
POST /api/auth/refresh           → {accessToken}
POST /api/auth/logout            → 204
GET  /api/auth/me                → UserResponse
PUT  /api/auth/me                → UserResponse
````

### Rooms
````
GET    /api/rooms                → paginated, filter: type, priceMin, priceMax, maxOccupancy, available
GET    /api/rooms/{id}
GET    /api/rooms/{id}/availability?checkIn=&checkOut=
POST   /api/rooms                (MANAGER+)
PUT    /api/rooms/{id}           (MANAGER+)
DELETE /api/rooms/{id}           (ADMIN)
````

### Bookings
````
GET    /api/bookings             — own for GUEST, all for RECEPTIONIST+
GET    /api/bookings/{id}
POST   /api/bookings             — body: {roomId, checkIn, checkOut, guests, loyaltyPointsToUse, specialRequests}
                                   response includes full PricingResult breakdown
POST   /api/bookings/{id}/pay    — body: {paymentMethod}; triggers MockPaymentGateway
PUT    /api/bookings/{id}/status — body: {status, reason}; RECEPTIONIST+
GET    /api/bookings/{id}/invoice — returns application/pdf
DELETE /api/bookings/{id}        — ADMIN
````

### Services & Orders
````
GET  /api/services
GET  /api/services/{id}
POST /api/services               (MANAGER+)
PUT  /api/services/{id}          (MANAGER+)
GET  /api/services/recommendations  — personalized for current user (Algorithm 2)
GET  /api/service-orders
POST /api/service-orders
PUT  /api/service-orders/{id}/status
````

### Reviews
````
GET  /api/reviews?roomId=&approved=true
POST /api/reviews                — body: {bookingId, rating, comment}; must be CHECKED_OUT booking
PUT  /api/reviews/{id}/approve   (MANAGER+)
DELETE /api/reviews/{id}         (ADMIN)
````

### Admin
````
GET /api/admin/analytics/dashboard   — {totalRevenue, occupancyRate, bookingsByStatus, topRooms, revenueByMonth}
GET /api/admin/analytics/forecast    — 30-day occupancy forecast (Algorithm 3)
GET /api/admin/analytics/sentiment   — average sentiment per room (Algorithm 4)
GET /api/admin/audit-logs            — paginated, filter: entityType, action, from, to
GET|POST|PUT|DELETE /api/admin/pricing-rules
GET /api/admin/users                 — paginated user list with roles
PUT /api/admin/users/{id}/role       — change role
````

---

## Mock Payment Gateway

`MockPaymentGateway implements PaymentGateway`:
````java
PaymentResult processPayment(UUID bookingId, BigDecimal amount, PaymentMethod method) {
    Thread.sleep(800); // simulate network latency
    boolean success = ThreadLocalRandom.current().nextDouble() > 0.1; // 90% success
    if (success) {
        String ref = "TXN-" + UUID.randomUUID().toString().substring(0,8).toUpperCase();
        return PaymentResult.success(ref);
    }
    return PaymentResult.failure("Insufficient funds — simulated");
}
````

On success: `booking.status = CONFIRMED`, `payment.status = COMPLETED`, loyalty points credited.
On failure: `booking.status = PENDING`, `payment.status = FAILED`, return error in response.

---

## PDF Invoice (iTextPDF 7)

`InvoiceService.generateInvoice(UUID bookingId)` returns `byte[]`:

Invoice layout:
1. Resort header (name, address, logo placeholder)
2. Invoice metadata (invoice #, date, booking ID)
3. Guest details (name, email, phone)
4. Room details table (room, dates, nights, base price per night)
5. Pricing breakdown table (base total, each applied rule with multiplier, loyalty discount, **FINAL TOTAL**)
6. Services ordered table (name, date, qty, price)
7. Payment confirmation block (transaction ref, method, status)
8. Footer with legal note

Use `PdfPTable` with 3–4 columns, alternate row shading, resort gold color (`#C9A96E`) for headers.

---

## Loyalty Points System

`LoyaltyService`:
- Earn: 1 point per 100 UAH spent on bookings
- Redeem: 100 points = 1% discount, max 15% (1500 points)
- `GET /api/loyalty/balance` — returns {points, equivalentDiscount}
- Points credited automatically on `booking.status = CHECKED_OUT`
- Points deducted on booking creation if `loyaltyPointsToUse > 0`
- Store in `users.loyalty_points`, log changes in audit_logs

---

## Frontend Structure

````
src/
├── api/
│   ├── client.ts              — Axios instance, interceptors, token refresh logic
│   └── endpoints/
│       ├── auth.api.ts
│       ├── rooms.api.ts
│       ├── bookings.api.ts
│       ├── services.api.ts
│       └── admin.api.ts
├── components/
│   ├── ui/                    — shadcn/ui components + custom variants
│   ├── layout/                — AppHeader, Footer, AdminSidebar, PageContainer
│   ├── rooms/                 — RoomCard, RoomFilters, RoomGallery, AvailabilityBadge
│   ├── bookings/              — BookingWizard (4 steps), PricingBreakdownPanel, BookingCard
│   ├── services/              — ServiceCard, RecommendedServices, ServiceOrderForm
│   ├── analytics/             — OccupancyChart, RevenueChart, ForecastChart, SentimentBadge
│   └── common/                — DataTable, EmptyState, LoadingSpinner, ErrorBoundary, ConfirmDialog
├── pages/
│   ├── Home.tsx
│   ├── Rooms.tsx / RoomDetail.tsx
│   ├── Services.tsx / ServiceDetail.tsx
│   ├── auth/ — Login.tsx, Register.tsx
│   ├── guest/ — Dashboard.tsx, MyBookings.tsx, MyServices.tsx, Profile.tsx, Loyalty.tsx
│   └── admin/ — AdminLayout.tsx, Analytics.tsx, RoomsManage.tsx, PricingRules.tsx, AuditLogs.tsx, UsersManage.tsx
├── store/
│   ├── authStore.ts           — {user, accessToken, login(), logout(), refreshToken()}
│   └── uiStore.ts             — {sidebarOpen, theme}
├── hooks/
│   ├── useRooms.ts, useBookings.ts, useServices.ts, useAdmin.ts, useRecommendations.ts
├── types/
│   ├── api.ts                 — mirrors all backend DTOs
│   └── domain.ts              — enums: BookingStatus, RoomType, UserRole, etc.
└── lib/
    ├── validators.ts          — all Zod schemas
    ├── utils.ts
    └── formatters.ts          — formatCurrency (UAH), formatDate, formatNights
````

---

## UI Design System

Colors:
````
--navy:     #0D1B2A
--gold:     #C9A96E
--gold-light: #E8D5B0
--cream:    #F7F3EE
--slate:    #4A5568
--success:  #2D6A4F
--error:    #C0392B
````

Typography: Playfair Display (headings via Google Fonts) + Inter (body)

Key UI patterns:
- Room cards: full-bleed image, overlay gradient, gold price badge bottom-left, star rating top-right
- Booking wizard: 4-step progress bar (Dates → Details → Payment → Confirm), step validation via Zod before advance
- Pricing breakdown: collapsible panel with animated height (Framer Motion), shows each pricing rule row with multiplier badge
- Admin analytics: dark card grid, Recharts AreaChart for revenue, BarChart for bookings by status, LineChart for 30-day forecast
- Audit logs: filterable timeline with color-coded action badges (CREATE=green, UPDATE=blue, DELETE=red, STATUS_CHANGE=amber)
- Forecast chart: dashed line for predicted values vs solid line for historical

Animations (Framer Motion):
- Page transitions: `opacity 0→1, y 20→0, duration 0.3`
- Card hover: `scale 1.02, shadow increase`
- Modal: `scale 0.95→1, opacity 0→1`

---

## Axios Interceptor Logic (client.ts)

````typescript
let isRefreshing = false;
let failedQueue: Array<{resolve: Function; reject: Function}> = [];

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => failedQueue.push({resolve, reject}))
          .then(token => { originalRequest.headers.Authorization = `Bearer ${token}`; return axiosInstance(originalRequest); });
      }
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const refreshToken = authStore.getState().refreshToken;
        const { data } = await axiosInstance.post('/auth/refresh', { refreshToken });
        authStore.getState().setAccessToken(data.accessToken);
        processQueue(null, data.accessToken);
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        authStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(err);
      } finally { isRefreshing = false; }
    }
    return Promise.reject(error);
  }
);
````

---

## Tests to Write

**Backend (JUnit 5 + Mockito):**
- `DynamicPricingServiceTest` — test each rule type, multiplier combinations, loyalty discount cap
- `RecommendationServiceTest` — empty history fallback, TF-IDF scoring, already-ordered exclusion
- `BookingServiceTest` — happy path, double-booking attempt, payment failure rollback
- `AuthServiceTest` — register, login, refresh, logout token invalidation

**Backend (Testcontainers integration):**
- `BookingConcurrencyIT` — 10 simultaneous booking attempts for same room/dates → exactly 1 succeeds

**Frontend (Vitest + RTL):**
- `BookingWizard.test.tsx` — step validation, pricing breakdown render, submit
- `PricingBreakdownPanel.test.tsx` — renders rules, correct total calculation
- `RecommendedServices.test.tsx` — renders empty state, renders list

---

## Academic Deliverables — Mermaid Diagrams

Create these files in `/docs/diagrams/`:

**use-case.md** — 4 actors (Guest, Receptionist, Manager, Admin), use cases grouped by actor

**erd.md** — Full ERD with all 11 tables, FK relationships, cardinality

**class-diagram.md** — Backend class diagram: entities + service interfaces + controllers

**sequence-booking.md** — Guest creates booking → DynamicPricingService → saves → pay → MockPaymentGateway → CONFIRMED/FAILED → loyalty points

**sequence-auth.md** — Login → JWT issued → protected request → 401 → refresh → retry → success

**component.md** — Browser (React SPA) ↔ Spring Boot REST API ↔ PostgreSQL; show Flyway and JWT filter

---

## Docker Setup

Generate `docker-compose.yml`:
````yaml
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: luxuryresort
      POSTGRES_USER: resort_user
      POSTGRES_PASSWORD: resort_pass
    ports: ["5432:5432"]
    volumes: [pgdata:/var/lib/postgresql/data]

  backend:
    build: ./backend
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/luxuryresort
      SPRING_DATASOURCE_USERNAME: resort_user
      SPRING_DATASOURCE_PASSWORD: resort_pass
      JWT_SECRET: ${JWT_SECRET}
      CORS_ORIGINS: http://localhost:5173
    ports: ["8080:8080"]
    depends_on: [postgres]

volumes:
  pgdata:
````

---

## Global Response Envelope

All API responses use:
````java
record ApiResponse<T>(boolean success, T data, String message, Map<String, String> errors) {
    static <T> ApiResponse<T> ok(T data) { return new ApiResponse<>(true, data, null, null); }
    static <T> ApiResponse<T> error(String msg, Map<String, String> errors) { return new ApiResponse<>(false, null, msg, errors); }
}
````

---

## Execution Order

Do these steps in exact order — do not skip ahead:

1. Generate full `pom.xml` with all dependencies
2. Write all Flyway SQL migrations
3. Create all JPA entities with Lombok
4. Create Spring Data JPA repositories
5. Create all DTOs (request + response) + MapStruct mappers
6. `SecurityConfig` + `JwtService` + `JwtAuthFilter`
7. Services in order: Auth → Room → DynamicPricing → Booking → Payment → ServiceOrder → Review → Recommendation → OccupancyForecast → Sentiment → Invoice → Loyalty → Audit
8. REST controllers + `GlobalExceptionHandler`
9. JUnit 5 unit tests + Testcontainers concurrency test
10. Vite + React + TS frontend init, configure Tailwind + shadcn/ui
11. `client.ts` Axios with interceptors, all typed API functions
12. Zustand stores, React Query hooks
13. Build pages: Home → Rooms → RoomDetail → BookingWizard → Auth → Guest dashboard → Admin dashboard
14. Framer Motion animations
15. Frontend tests
16. Mermaid diagrams in `/docs/`
17. `docker-compose.yml` + both `.env.example` files + README

Every class must be fully implemented — no TODO placeholders, no empty method bodies.