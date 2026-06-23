# F20 — client.ts (Axios) + typed APIs + Zustand + TanStack Query

## Related Execution Order step(s)

- **Step 11** — typed API functions, Axios interceptors  
- **Step 12** — Zustand stores, React Query hooks

## Status

`Done`

## Spec source

- [promt.md](../../../promt.md) — **Axios Interceptor Logic**, `api/client.ts`, `api/endpoints/*.ts`, `store/authStore.ts`, `hooks/*`

## Acceptance checklist

- [x] `api/http.ts`: base URL `/api` (Vite proxy), Authorization, **refresh queue** на 401 (`isRefreshing`, `failedQueue`, `_retry`, logout → `/login`).
- [x] `POST /auth/refresh` з `RefreshTokenResponse` (access + refresh) у обгортці `ApiResponse`.
- [x] `endpoints/*.ts` + `types/api.ts`.
- [x] `authStore` (persist) + `setTokensFromRefresh`.
- [x] `uiStore`: sidebarOpen, theme.
- [x] Hooks TanStack Query v5: `useRooms`, `useBookings`, `useServices`, `useAdmin`, `useRecommendations`, `useLoyalty`.

## Dependencies

- [F19](F19-frontend-init-design-system.md)
- [F17](F17-rest-controllers-exceptions.md) — стабільні контракти API

## Legacy (coursework) note

`AuthContext.jsx` + прямі Axios виклики — заміна на **Zustand + Query** і централізований refresh.

## Thesis section hint

«Взаємодія з сервером», керування сесією, кешування даних.

## Notes / Risks

- Уникнути циклічних імпортів між `client.ts` та `authStore`.

**Spec:** [promt.md](../../../promt.md)
