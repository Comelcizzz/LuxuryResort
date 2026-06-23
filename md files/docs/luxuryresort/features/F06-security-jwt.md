# F06 — SecurityConfig + JwtService + JwtAuthFilter

## Related Execution Order step(s)

- **Step 6** — [promt.md](../../../promt.md) (infrastructure/security, config, RBAC Matrix)

## Status

`Done` (обертання refresh-токена в БД, видача токенів у відповідях — у F07 `AuthService`). Rate limit: `POST /api/auth/login|register` (узгоджено з REST у `promt.md`).

## Spec source

- [promt.md](../../../promt.md) — **RBAC Matrix**, package `infrastructure/security/`, **sequence-auth** (F23)

## Acceptance checklist

- [x] `JwtService`: генерація access/refresh, валідація, claims `sub` (user id), `email`, `role`, `typ` (`access` / `refresh`).
- [x] `JwtAuthFilter`: витяг Bearer токена, установка `SecurityContext` (ролі як `ROLE_*`).
- [x] `CustomUserDetailsService` — `loadUserByUsername(email)` для пароля / майбутнього `AuthenticationManager`.
- [x] `SecurityConfig`: stateless, без anonymous, JWT filter перед `UsernamePasswordAuthenticationFilter`, публічні `POST /api/auth/register|login|refresh`, каталог GET rooms/services/reviews, решта `/api/**` — `authenticated()` + role-матчери під RBAC.
- [x] `@EnableMethodSecurity` — для `@PreAuthorize` у сервісах/контролерах (F17).
- [x] CORS без змін: існуючий `CorsConfig` + `CORS_ORIGINS` у prod/docker.
- [x] `JwtProperties` + `JwtConfig` (`app.jwt.secret`, `access-token-ttl`, `refresh-token-ttl`); prod/docker: `JWT_SECRET` без дефолту в yaml.

## Dependencies

- [F05](F05-dtos-mapstruct.md) частково (User entity для UserDetails)
- [F04](F04-jpa-repositories.md) — UserRepository

## Legacy (coursework) note

У курсовій — middleware JWT у Express. Концепція та сама; реалізація — **Spring Security 6** filter chain.

## Thesis section hint

«Захист даних та доступу», модель ролей, опис JWT та оновлення токена.

## Notes / Risks

- Чітко розділити публічні маршрути (register, login, refresh) і захищені.
- Перевірити узгодженість ролей у БД enum і в `hasRole('ADMIN')` (префікс `ROLE_`).

**Spec:** [promt.md](../../../promt.md)
