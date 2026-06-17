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
├── api/               # Axios instance with interceptors
├── components/        # Reusable UI components (Navbar, SkeletonCard, ProtectedRoute)
├── config/            # Environment variables
├── constants/         # API endpoint definitions
├── hooks/             # Custom hooks (useAuth, useCart, useFavorites, useTheme)
├── pages/             # Route-level page components
│   ├── Cart/
│   ├── Favorites/
│   ├── Login/
│   ├── ProductDetail/
│   ├── Products/
│   └── Profile/
├── routes/            # AppRoutes with lazy-loaded pages
├── store/             # Zustand stores (auth, cart, theme)
├── test/              # Test setup files
└── App.tsx            # Root component with theme sync & skip link
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

## Bonus Features Implemented

| Bonus | Status | Notes |
|-------|--------|-------|
| **Silent Token Refresh** | ✅ Implemented | Axios interceptor catches 401, queues requests, and swaps the access token via `/auth/refresh` |
| **URL-Synced State** | ✅ Implemented | `useSearchParams` syncs search + category + pagination to the URL |
| **Request Cancellation** | ✅ Implemented | `AbortController` in `axiosInstance.ts` allows cancelling in-flight requests |
| **Cart** | ✅ Implemented | Per-user `localStorage`, quantity controls, order summary, remove items |
| **Optimistic UI** | ✅ Implemented | Add/remove cart and favorites update instantly; rollback happens automatically via localStorage |
| **Tests** | ✅ Implemented | Vitest + React Testing Library for `ProtectedRoute` redirect logic |
| **Accessibility** | ✅ Implemented | Keyboard nav, ARIA labels, visible `focus-visible` rings, skip link, `prefers-color-scheme` default |
| **Skeleton Loaders** | ✅ Implemented | `SkeletonCard` component used on product grid and favorites |
| **Performance** | ✅ Implemented | Route-level lazy loading, `React.memo` on pure icons, `useMemo` for cart/favorites calculations |
| **Form Quality** | ✅ Implemented | React Hook Form + Zod validation with production-grade error messages |
| **Toasts / Notifications** | ✅ Implemented | Sonner with 1000ms duration for quick, non-intrusive feedback |
| **Session Expiry UX** | ✅ Implemented | Graceful toast + 1.5s delayed redirect instead of a hard reload |

## What I'd Improve With More Time

- **Error Boundary** — A top-level React error boundary to catch render crashes gracefully.
- **Image Optimization** — Use `srcset` + lazy-loaded images for the product gallery to reduce LCP.
- **Infinite Scroll** — Replace pagination with virtualized infinite scroll for smoother browsing.
- **Server-Side Cart** — Move cart state from `localStorage` to a backend endpoint for multi-device sync.
- **E2E Testing** — Add Playwright or Cypress tests for the full login → add-to-cart → checkout flow.
- **PWA Support** — Add a service worker and `manifest.json` for offline browsing.
- **Rate Limiting UI** — Show a countdown or retry button if the API returns a 429.

## License

This project is for educational and demonstration purposes.
