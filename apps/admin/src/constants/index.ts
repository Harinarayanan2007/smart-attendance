export const APP_NAME = 'Smart Attendance Admin';
export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
export const STORAGE_KEYS = {
    auth: 'smart-attendance-auth',
    theme: 'smart-attendance-theme',
};
export const ROUTES = {
    login: '/login',
    dashboard: '/dashboard',
    unauthorized: '/unauthorized',
};
export const PAGINATION = {
    pageSize: 10,
};
export const ROLES = {
    admin: 'ADMIN',
    faculty: 'FACULTY',
    student: 'STUDENT',
} as const;
