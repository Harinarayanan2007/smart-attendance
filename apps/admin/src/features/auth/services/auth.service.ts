import { authApi } from '@/features/auth/api/auth.api';
import type { LoginRequest, LoginResponse } from '@/features/auth/types/auth.types';

/**
 * Auth service — thin orchestration layer over authApi.
 *
 * Token storage is handled exclusively by Zustand persist;
 * this service only manages API calls.
 */
export const authService = {
    /** Authenticate with the backend and return the full response. */
    async login(payload: LoginRequest): Promise<LoginResponse> {
        return authApi.login(payload);
    },

    /** Verify whether the stored access token is still accepted by the backend. */
    async verifySession(): Promise<boolean> {
        return authApi.verifyToken();
    },
};
