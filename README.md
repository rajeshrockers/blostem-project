# Blostem

A modern, accessible e-commerce storefront built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**. Browse products, manage favorites, and build a shopping cart — all with a polished dark-mode UI and full keyboard support.

![Tech Stack](https://img.shields.io/badge/React-18.3-blue?logo=react)
![Tech Stack](https://img.shields.io/badge/TypeScript-5.4-blue?logo=typescript)
![Tech Stack](https://img.shields.io/badge/Vite-5.3-purple?logo=vite)
![Tech Stack](https://img.shields.io/badge/Tailwind-3.4-cyan?logo=tailwindcss)

**🚀 Live Demo:** [blostem-project.vercel.app](https://blostem-project.vercel.app/)

## Features

| Feature | Description |
|---------|-------------|
| **Product Catalog** | Browse products with debounced search, category filtering, and pagination synced to the URL |
| **Product Detail** | View full product info, image gallery, stock levels, and brand details |
| **Favorites** | Save products to favorites — persisted per-user in `localStorage` |
| **Shopping Cart** | Add items with quantity controls, order summary total, and per-user persistence |
| **Authentication** | Secure login with JWT access & refresh tokens; protected routes for favorites, cart, and profile |
| **Silent Token Refresh** | Automatic token refresh on 401 responses with request queuing |
| **Session Expiry UX** | Graceful toast notification + delayed redirect instead of an abrupt logout |
| **Dark Mode** | System-aware default theme (`prefers-color-scheme`) with manual toggle and persistence |
| **Accessibility** | Keyboard navigation, ARIA labels, visible focus rings, skip-to-content link, and landmark regions |
| **Code Splitting** | Route-level `React.lazy()` loading with a shared suspense fallback |
| **Performance** | Memoized icon components and `useMemo` for derived data (cart totals, filtered favorites) |
| **Testing** | Unit/component tests with Vitest, JSDOM, and React Testing Library |

## Tech Stack

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **State Management:** Zustand (auth, cart, theme)
- **Forms & Validation:** React Hook Form + Zod
- **HTTP Client:** Axios (with interceptors for auth & refresh)
- **Routing:** React Router v6
- **Notifications:** Sonner
- **Testing:** Vitest + React Testing Library + JSDOM

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- npm (comes with Node.js)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/rajeshrockers/blostem-project.git
   cd blostem-project
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

The output will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

### Run Tests

```bash
npm test
```

## Project Structure

```
src/
├── api/
│   ├── interceptors/    # Axios instance with request/response interceptors
│   └── services/        # API service classes (AuthService, ProductService)
├── components/
│   ├── common/          # Shared UI components (Button, Card, EmptyState, etc.)
│   ├── icons/           # SVG icons (HeartIcon, SunIcon, MoonIcon, CartIcon)
│   ├── layout/          # Navbar
│   ├── Loader/          # Skeleton loaders (SkeletonCard, SkeletonProfile, etc.)
│   └── product/         # Product-specific components (ProductCard, ImageGallery, ProductInfo)
├── config/              # Environment variable config
├── constants/           # Constants (ENDPOINTS, MAGIC_NUMBER)
├── hooks/               # Custom hooks (useAuth, useCart, useDebounce, useFavorites, useTheme)
├── pages/               # Route-level page components
│   ├── Cart/
│   ├── Favorites/
│   ├── Login/
│   ├── ProductDetail/
│   ├── Products/
│   └── Profile/
├── routes/              # AppRoutes, ProtectedRoute, PublicRoute
├── store/               # Zustand stores (auth, cart, theme)
├── test/                # Test setup & component tests
├── types/               # Centralized TypeScript interfaces
└── App.tsx              # Root component with theme sync & skip link
```

## Default Login Credentials

| Field | Value |
|-------|-------|
| Username | `emilys` |
| Password | `emilyspass` |

These credentials use the [DummyJSON](https://dummyjson.com/) auth API.

## API Reference

This app consumes the [DummyJSON](https://dummyjson.com/) REST API:

| Endpoint | Purpose |
|----------|---------|
| `POST /auth/login` | Authenticate and receive JWT tokens |
| `POST /auth/refresh` | Refresh an expired access token |
| `GET /products` | List all products |
| `GET /products/:id` | Get a single product |
| `GET /products/categories` | Get available categories |

## Accessibility Highlights

- **Keyboard Navigation** — All interactive elements are focusable and operable via keyboard
- **Visible Focus States** — `focus-visible` rings on every button, link, and input
- **ARIA Labels** — Descriptive labels on icon-only buttons (favorites, cart, theme toggle)
- **Skip Link** — "Skip to main content" link for screen reader users
- **Landmarks** — `<nav>` and `<main>` regions for easier page navigation
- **Color Contrast** — Text and backgrounds meet WCAG contrast guidelines in both themes

## Environment Variables

Create a `.env` file in the project root (or use the existing one):

```env
VITE_API_BASE_URL=https://dummyjson.com
```

> Variables prefixed with `VITE_` are exposed to the client bundle.

## Key Decisions & Trade-offs

### Zustand over Context or Redux
I chose **Zustand** for state management because it provides a minimal, hook-based API with zero boilerplate and built-in TypeScript support. Unlike Redux, it doesn't require actions, reducers, or middleware to achieve persistence — I just wrote a few lines of `localStorage` logic directly in the stores.

### localStorage for Cart & Favorites
The cart and favorites are persisted to `localStorage` scoped by `userId`. I chose this over an API-backed approach because the DummyJSON API doesn't provide endpoints for user-specific cart/favorite data. In a real app, these would be server-side tables.

### Silent Token Refresh with Axios Interceptors
Refresh logic lives in the Axios response interceptor rather than a React hook. This keeps token management decoupled from UI components and ensures *all* 401 errors are handled uniformly — including those fired from background data fetches.

### React.lazy Route Splitting
Each page is wrapped in `React.lazy()`. On a small app the bundle savings are modest, but it enforces a scalable pattern and keeps the initial chunk lean as more pages are added.

### URL-Synced State for Filters
Search and category filters are reflected in the URL query string (`?q=phone&category=smartphones`). This makes pagination, filtering, and deep-linking shareable and restorable on page refresh.

### Service Classes for API Calls
All HTTP requests are centralized in `AuthService` and `ProductService` under `api/services/`. Pages and hooks import these classes rather than calling `axiosInstance` directly. This makes the API layer testable, reusable, and easy to swap if the backend changes.

### Shared UI Components in `components/common/`
Repeated UI patterns — `PageContainer`, `PageHeading`, `EmptyState`, `ErrorState`, `Card`, `Button` — are extracted into a shared `common/` folder. Every page uses these instead of duplicating Tailwind class strings, keeping the codebase DRY and consistent.

### `MAGIC_NUMBER` Constants
All inline numeric literals (pagination limits, debounce delays, skeleton counts, timeouts) are extracted to a single `MAGIC_NUMBER` object in `constants.ts`. This makes the app self-documenting and trivial to tune without hunting through files.

## Bonus Features Implemented

| Bonus | Status | Notes |
|-------|--------|-------|
| **Silent Token Refresh** | ✅ Implemented | Axios interceptor catches 401, queues requests, and swaps the access token via `/auth/refresh` |
| **URL-Synced State** | ✅ Implemented | `useSearchParams` syncs search + category + pagination to the URL |
| **Request Cancellation** | ✅ Implemented | `AbortController` in `ProductsPage` cancels in-flight requests on new filter/page changes |
| **Cart** | ✅ Implemented | Per-user `localStorage`, quantity controls, order summary, remove items |
| **Optimistic UI** | ✅ Implemented | Add/remove cart and favorites update instantly; rollback happens automatically via localStorage |
| **Tests** | ✅ Implemented | Vitest + React Testing Library for `ProtectedRoute` redirect logic |
| **Accessibility** | ✅ Implemented | Keyboard nav, ARIA labels, visible `focus-visible` rings, skip link, `prefers-color-scheme` default |
| **Skeleton Loaders** | ✅ Implemented | `SkeletonCard` component used on product grid and favorites |
| **Performance** | ✅ Implemented | Route-level lazy loading, `React.memo` on pure icons, `useMemo` for cart/favorites calculations |
| **Form Quality** | ✅ Implemented | React Hook Form + Zod validation with production-grade error messages |
| **Toasts / Notifications** | ✅ Implemented | Sonner with `MAGIC_NUMBER.ONE_THOUSAND` duration for quick, non-intrusive feedback |
| **Session Expiry UX** | ✅ Implemented | Graceful toast + `MAGIC_NUMBER.FIFTEEN_HUNDRED` delayed redirect instead of a hard reload |
| **Magic Number Constants** | ✅ Implemented | All numeric literals extracted to `MAGIC_NUMBER` constants in `constants.ts` |
| **API Services** | ✅ Implemented | `AuthService` and `ProductService` classes centralize all API calls |
| **PublicRoute Guard** | ✅ Implemented | Authenticated users are redirected away from public-only pages like `/login` |

## What I'd Improve With More Time

- **Error Boundary** — A top-level React error boundary to catch render crashes gracefully.
- **Image Optimization** — Use `srcset` + lazy-loaded images for the product gallery to reduce LCP.
- **Server-Side Cart** — Move cart state from `localStorage` to a backend endpoint for multi-device sync.
- **E2E Testing** — Add Playwright or Cypress tests for the full login → add-to-cart → checkout flow.
- **PWA Support** — Add a service worker and `manifest.json` for offline browsing.
- **Rate Limiting UI** — Show a countdown or retry button if the API returns a 429.

## Self-Assessment & Completed Work

### Core Requirements

| Requirement | Status | Where to find it |
|-------------|--------|-----------------|
| Public + protected routes | ✅ | `src/routes/AppRoutes.tsx` — `PublicRoute` for `/`, `/login`; `ProtectedRoute` for `/favorites`, `/cart`, `/profile` |
| Redirect to login when not authenticated | ✅ | `src/routes/ProtectedRoute.tsx` — `Navigate` to `/login` with `state: { from: location }` |
| Redirect back to originally requested page after login | ✅ | `src/pages/Login/LoginPage.tsx` — reads `location.state.from` via `useLocation` and navigates back |
| Logged-in user redirected away from `/login` | ✅ | `src/routes/PublicRoute.tsx` — `Navigate` to `/` when `isAuthenticated` |
| Login + inline validation + error on bad credentials | ✅ | `src/pages/Login/LoginPage.tsx` — React Hook Form + Zod schema, toast error on catch block |
| Session persists across refresh | ✅ | `src/hooks/useAuth.ts` — fetches `/auth/me` on mount; `src/store/authStore.ts` — rehydrates from localStorage |
| Working logout with state cleanup | ✅ | `src/store/authStore.ts` — `clearToken()` removes `token`, `refreshToken`, `userId`; `src/pages/Profile/ProfilePage.tsx` — also clears favorites on logout |
| Single configured HTTP client with auto token injection | ✅ | `src/api/interceptors/axiosInstance.ts` — request interceptor reads token from localStorage and injects `Authorization` header |
| 401 response handling (clear session → cleanup → redirect to login) | ✅ | `src/api/interceptors/axiosInstance.ts` — `handleResponseError()` catches 401, attempts refresh, falls back to clearing auth + toast + redirect |
| Product list with debounced search | ✅ | `src/pages/Products/ProductsPage.tsx` — `useDebounce` at 400ms (`MAGIC_NUMBER.FOUR_HUNDRED`) |
| Category filter | ✅ | `src/pages/Products/ProductsPage.tsx` — `<select>` bound to `useSearchParams` category param |
| Pagination / infinite scroll | ✅ | `src/pages/Products/ProductsPage.tsx` — `react-virtuoso` VirtuosoGrid with `endReached` + `page` state |
| Product detail page | ✅ | `src/pages/ProductDetail/ProductDetailPage.tsx` |
| Add/remove favorites (from list + detail) | ✅ | `src/components/product/ProductCard.tsx` and `ProductInfo.tsx` — heart icon toggles favorite |
| Favorites persist and are scoped per user | ✅ | `src/hooks/useFavorites.ts` — localStorage key includes `userId` (`favorites_user_${userId}`) |
| Dark / light mode toggle, persisted | ✅ | `src/store/themeStore.ts` — `prefers-color-scheme` default, toggle writes to localStorage |
| Loading / error / empty states everywhere data is fetched | ✅ | `EmptyState`, `ErrorState`, `SkeletonCard`, `SkeletonProfile`, `ProductDetailSkeleton` in `components/common/` and `components/Loader/` |

### Bonus Items Attempted

| Bonus | Done? | Where in the code / how to test it |
|-------|-------|-------------------------------------|
| 1. Silent token refresh | ✅ Yes | `src/api/interceptors/axiosInstance.ts` — on 401, tries `POST /auth/refresh`; if refresh also fails, clears session and redirects |
| 2. URL-synced state | ✅ Yes | `src/pages/Products/ProductsPage.tsx` — `useSearchParams` syncs `?q=...&category=...` to URL; shareable and survives refresh |
| 3. Request cancellation | ✅ Yes | `src/pages/Products/ProductsPage.tsx` — `AbortController` created per effect; previous request is aborted before new one starts |
| 4. Cart | ✅ Yes | `src/hooks/useCart.ts` + `src/pages/Cart/CartPage.tsx` — quantity controls, order summary total, per-user localStorage |
| 5. Optimistic UI | ✅ Yes | `src/components/product/ProductCard.tsx` — favorite/cart toggles update UI instantly; localStorage is the source of truth |
| 6. Tests | ✅ Yes | `src/test/ProtectedRoute.test.tsx` — Vitest + React Testing Library for redirect logic |
| 7. Accessibility | ✅ Yes | Keyboard nav on all buttons, ARIA labels, `focus-visible` rings, skip-to-content link, `prefers-color-scheme` default |
| 8. Skeleton loaders | ✅ Yes | `src/components/Loader/SkeletonCard.tsx`, `SkeletonProfile.tsx`, `ProductDetailSkeleton.tsx` |
| 9. Performance | ✅ Yes | Route-level `React.lazy()` in `AppRoutes.tsx`; `React.memo` on icons; `react-virtuoso` for virtualized product grid |
| 10. Form quality | ✅ Yes | `src/pages/Login/LoginPage.tsx` — Zod schema (`loginSchema`) with detailed error messages; submit button disabled while loading |
| 11. Toasts / notifications | ✅ Yes | `Sonner` used globally in `App.tsx` for favorites, cart, login, logout, session expiry |
| 12. Session expiry UX | ✅ Yes | `src/api/interceptors/axiosInstance.ts` — toast "Your session has expired" + `MAGIC_NUMBER.FIFTEEN_HUNDRED` ms redirect instead of hard reload |
| 13. Deployment | ✅ Yes | Deployed to Vercel: [blostem-project.vercel.app](https://blostem-project.vercel.app/) |

### Extra Architecture Improvements (not in original list)

| Extra | Description |
|-------|-------------|
| **API Service Classes** | `AuthService` and `ProductService` in `src/api/services/` — no inline `axiosInstance.get/post` in pages |
| **Shared UI Components** | `PageContainer`, `PageHeading`, `EmptyState`, `ErrorState`, `Card`, `Button` in `src/components/common/` |
| **`MAGIC_NUMBER` Constants** | All numeric literals extracted to `constants.ts` (`TWENTY`, `EIGHT`, `FIVE_HUNDRED`, `THIRTY_THOUSAND`, etc.) |
| **Centralized Types** | All interfaces in `src/types/index.ts` — consumed by components, services, and hooks |
| **PublicRoute Guard** | Prevents authenticated users from visiting `/login` or the public home page (redirects to `/`) |
| **Auth Guard on Favorites** | Heart icon on product cards requires login — shows toast error and redirects after 1s |

## License

This project is for educational and demonstration purposes.
