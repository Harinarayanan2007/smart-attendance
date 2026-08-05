import { ROUTES } from '@/constants';
import axios, { AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

/* ── Request interceptor ─────────────────────────────────────────────── */
api.interceptors.request.use((config) => {
    // Read the token from the Zustand persisted store in localStorage.
    // We import the store lazily to avoid circular dependencies.
    try {
        const raw = localStorage.getItem('smart-attendance-auth');
        if (raw) {
            const persisted = JSON.parse(raw) as { state?: { accessToken?: string } };
            const token = persisted?.state?.accessToken;
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
    } catch {
        // Storage access failed — continue without token.
    }

    return config;
});

/* ── Response interceptor ────────────────────────────────────────────── */
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError<{ success?: boolean; error?: { code?: string; message?: string } }>) => {
        const status = error.response?.status;
        const serverMessage = error.response?.data?.error?.message;
        const message = serverMessage ?? error.message ?? 'An unexpected error occurred';

        if (import.meta.env.VITE_ENABLE_LOGGING === 'true') {
            console.error(`[api] ${status ?? 'network'}:`, message);
        }

        /* 401 Unauthorized — session expired or invalid token */
        if (status === 401) {
            // Clear the persisted auth state so the app treats the user as logged out.
            try {
                localStorage.removeItem('smart-attendance-auth');
            } catch {
                // Best-effort cleanup.
            }

            // Redirect to login (avoid redirect loops if already on /login).
            if (typeof window !== 'undefined' && !window.location.pathname.startsWith(ROUTES.login)) {
                window.location.href = ROUTES.login;
            }
        }

        /* 403 Forbidden — authenticated but insufficient role */
        if (status === 403) {
            if (typeof window !== 'undefined' && !window.location.pathname.startsWith(ROUTES.unauthorized)) {
                window.location.href = ROUTES.unauthorized;
            }
        }

        // Reject with a structured object the store / UI can consume.
        return Promise.reject({ status, message, code: error.response?.data?.error?.code });
    },
);

export const getApiClient = () => api;
export const request = <T>(config: AxiosRequestConfig) => api.request<T>(config);
export default api;
