import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { toast } from 'sonner';
import { ENV } from '../config/env';
import { useAuthStore } from '../store/authStore';
import { ENDPOINTS } from '../constants/endponint';

const AUTH_TOKEN_KEY = 'token';
const DEFAULT_TIMEOUT = 30_000;

// Token helpers
function getAuthToken(): string | null {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

function clearAuthData(): void {
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem('refreshToken');
  } catch {
    // ignore
  }
}

// Logging (dev only)
function logRequest(config: InternalAxiosRequestConfig): void {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config);
  }
}

function logResponse(response: AxiosResponse): void {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.log(`[API Response] ${response.status} ${response.config.url}`, response.data);
  }
}

function logError(error: AxiosError | Error): void {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.error('[API Error]', error);
  }
}

// Error handling
function getErrorMessageFromStatus(status: number): string {
  switch (status) {
    case 400: return 'Bad request. Please check your input and try again.';
    case 401: return 'Your session has expired. Please log in again.';
    case 403: return 'You do not have permission to perform this action.';
    case 404: return 'The requested resource was not found.';
    case 422: return 'Validation failed. Please correct the errors and try again.';
    case 500: return 'An unexpected server error occurred. Please try again later.';
    default:  return 'An unexpected error occurred. Please try again.';
  }
}

function extractErrorMessage(error: AxiosError<unknown>): string {
  if (error.code === 'ECONNABORTED') {
    return 'The request timed out. Please check your connection and try again.';
  }
  if (error.code === 'ERR_NETWORK') {
    return 'Network error. Please check your internet connection and try again.';
  }
  if (error.response) {
    const { status, data } = error.response;
    if (
      typeof data === 'object' &&
      data !== null &&
      'message' in data &&
      typeof (data as Record<string, unknown>).message === 'string'
    ) {
      return (data as Record<string, unknown>).message as string;
    }
    return getErrorMessageFromStatus(status);
  }
  return error.message || 'An unexpected error occurred.';
}

// Silent refresh state
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

function addRefreshSubscriber(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

function onRefreshed(newToken: string) {
  refreshSubscribers.forEach((cb) => cb(newToken));
  refreshSubscribers = [];
}

function handleResponseError(error: AxiosError<unknown>): Promise<never> {
  logError(error);

  const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

  // 401 handling with silent token refresh
  if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      clearAuthData();
      useAuthStore.getState().clearToken();
      toast.error('Your session has expired. Please log in again.');
      const currentPath = window.location.pathname + window.location.search;
      const loginPath = currentPath === '/login' ? '/login' : `/login?redirect=${encodeURIComponent(currentPath)}`;
      setTimeout(() => {
        window.location.href = loginPath;
      }, 1500);
      (error as AxiosError & { userMessage: string }).userMessage = extractErrorMessage(error);
      return Promise.reject(error);
    }

    // Another request is already refreshing — queue this one
    if (isRefreshing) {
      return new Promise((resolve) => {
        addRefreshSubscriber((newToken: string) => {
          if (originalRequest.headers) {
            originalRequest.headers.set('Authorization', `Bearer ${newToken}`);
          }
          resolve(axiosInstance(originalRequest));
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    return new Promise((resolve, reject) => {
      axios
        .post<{ token: string }>(`${ENV.API_BASE_URL}${ENDPOINTS.AUTH.REFRESH}`, { refreshToken })
        .then(({ data }) => {
          const newToken = data.token;
          useAuthStore.getState().updateAccessToken(newToken);

          if (originalRequest.headers) {
            originalRequest.headers.set('Authorization', `Bearer ${newToken}`);
          }

          onRefreshed(newToken);
          resolve(axiosInstance(originalRequest));
        })
        .catch((refreshError) => {
          useAuthStore.getState().clearToken();
          toast.error('Your session has expired. Please log in again.');
          const currentPath = window.location.pathname + window.location.search;
          const loginPath = currentPath === '/login' ? '/login' : `/login?redirect=${encodeURIComponent(currentPath)}`;
          setTimeout(() => {
            window.location.href = loginPath;
          }, 1500);
          reject(refreshError);
        })
        .finally(() => {
          isRefreshing = false;
        });
    });
  }

  (error as AxiosError & { userMessage: string }).userMessage = extractErrorMessage(error);
  return Promise.reject(error);
}

// Axios instance
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: DEFAULT_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor: attach JWT token
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAuthToken();
    if (token && config.headers) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    logRequest(config);
    return config;
  },
  (error: AxiosError) => {
    logError(error);
    return Promise.reject(error);
  }
);

// Response interceptor: log + handle errors
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    logResponse(response);
    return response;
  },
  (error: AxiosError<unknown>) => handleResponseError(error)
);

export type { AxiosError, AxiosResponse, AxiosRequestConfig };
