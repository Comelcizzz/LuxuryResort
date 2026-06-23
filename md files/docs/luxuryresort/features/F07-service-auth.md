# F07 — AuthService (register, login, refresh, logout, me)

## Related Execution Order step(s)

- **Step 7** (перший сервіс у ланцюжку) — [promt.md](../../../promt.md) REST Auth, refresh_tokens table

## Status

`Done` — `AuthService` + `AuthController`; refresh rotation (новий refresh у відповіді разом з access для F20).

## Spec source

- [promt.md](../../../promt.md) — **REST API → Auth**, **Axios Interceptor Logic** (контракт refresh), Execution Order service list: **Auth** first

## Acceptance checklist

- [x] `POST /api/auth/register` → `ApiResponse` з `AuthResponse` (`accessToken`, `refreshToken`, `user`)
- [x] `POST /api/auth/login` → те саме; попередні refresh-сесії користувача відкликаються
- [x] `POST /api/auth/refresh` → `ApiResponse` з `RefreshTokenResponse` (`accessToken`, `refreshToken` після rotation)
- [x] `POST /api/auth/logout` → **204**, `revokeAllActiveForUser`
- [x] `GET/PUT /api/auth/me` → `ApiResponse<UserResponse>`
- [x] BCrypt (F06 `PasswordEncoder`), унікальний email → **409** `DuplicateEmailException`
- [x] Refresh у БД: **SHA-256 hex** від compact JWT, `expires_at`, `revoked`; парсинг refresh через `JwtService`
- [x] Інтеграція з F06 (`JwtService`, JWT filter); локальні `@ExceptionHandler` у `AuthController` до F17

## Dependencies

- [F06](F06-security-jwt.md)

## Legacy (coursework) note

`legacy/backend/routes/auth.js`, `authController` — аналог функціоналу; диплом додає **refresh token у БД** та формальний RBAC під 4 ролі.

## Thesis section hint

«Підсистема автентифікації та сесій», порівняння з курсовою реалізацією.

## Notes / Risks

- Узгодити формат помилок з `ApiResponse` / `GlobalExceptionHandler` (F17).

**Spec:** [promt.md](../../../promt.md)
