export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://dummyjson.com';

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    ME: '/auth/me',
    REFRESH: '/auth/refresh',
  },
  PRODUCTS: {
    LIST: '/products',
    SEARCH: '/products/search',
    CATEGORIES: '/products/categories',
    BY_CATEGORY: (category: string) => `/products/category/${category}`,
    DETAIL: (id: string | number) => `/products/${id}`,
  },
} as const;
