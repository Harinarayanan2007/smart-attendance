import { STORAGE_KEYS } from '@/constants';
import { authService } from '@/features/auth/services/auth.service';
import type { AuthError, AuthUser } from '@/features/auth/types/auth.types';
import { isSessionValid } from '@/features/auth/utils/session';
import { notifyError, notifySuccess } from '@/lib/toast';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
    /* ── Data ────────────────────────────────────────────── */
    user: AuthUser | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: AuthError | null;

    /* ── Actions ─────────────────────────────────────────── */
    login: (payload: { loginId: string; password: string }) => Promise<void>;
    logout: () => void;
    initialize: () => void;
    clear: () => void;
    setError: (error: AuthError | null) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            /* ── Initial state ──────────────────────────────── */
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            /* ── Login ──────────────────────────────────────── */
            login: async (payload) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await authService.login(payload);
                    set({
                        user: response.user,
                        accessToken: response.accessToken,
                        refreshToken: response.refreshToken,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null,
                    });
                    notifySuccess('Signed in successfully');
                } catch (error: unknown) {
                    const authError: AuthError = {
                        message: 'Login failed. Please check your credentials.',
                    };

                    if (error && typeof error === 'object') {
                        const err = error as Record<string, unknown>;
                        if (typeof err.message === 'string') {
                            authError.message = err.message;
                        }
                        if (typeof err.status === 'number') {
                            authError.status = err.status;
                        }
                        if (typeof err.code === 'string') {
                            authError.code = err.code;
                        }
                    }

                    set({ isLoading: false, error: authError });
                    notifyError(authError.message);
                    throw error;
                }
            },

            /* ── Logout ─────────────────────────────────────── */
            logout: () => {
                set({
                    user: null,
                    accessToken: null,
                    refreshToken: null,
                    isAuthenticated: false,
                    isLoading: false,
                    error: null,
                });
                notifySuccess('Signed out');
            },

            /* ── Initialize (called on app startup) ────────── */
            initialize: () => {
                const { accessToken } = get();
                if (accessToken && isSessionValid(accessToken)) {
                    // Token exists and hasn't expired client-side — keep session.
                    // Zustand persist already restored user/tokens from storage.
                    set({ isAuthenticated: true, isLoading: false });
                } else {
                    // No valid token — clear stale data.
                    get().clear();
                }
            },

            /* ── Clear (hard reset without toast) ───────────── */
            clear: () => {
                set({
                    user: null,
                    accessToken: null,
                    refreshToken: null,
                    isAuthenticated: false,
                    isLoading: false,
                    error: null,
                });
            },

            /* ── Set error ──────────────────────────────────── */
            setError: (error) => set({ error }),
        }),
        {
            name: STORAGE_KEYS.auth,
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                isAuthenticated: state.isAuthenticated,
            }),
        },
    ),
);
