import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

const ProductsPage = lazy(() => import('../pages/Products/ProductsPage'));
const ProductDetailPage = lazy(() => import('../pages/ProductDetail/ProductDetailPage'));
const LoginPage = lazy(() => import('../pages/Login/LoginPage'));
const FavoritesPage = lazy(() => import('../pages/Favorites/FavoritesPage'));
const ProfilePage = lazy(() => import('../pages/Profile/ProfilePage'));
const CartPage = lazy(() => import('../pages/Cart/CartPage'));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-10 h-10 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 rounded-full animate-spin" />
    </div>
  );
}

// Top-level router with a persistent Navbar above all routes.
export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Navbar />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route
            path="/"
            element={
              <PublicRoute>
                <ProductsPage />
              </PublicRoute>
            }
          />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <FavoritesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
