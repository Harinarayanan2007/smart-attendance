import type { LoginRequest, LoginResponse, MeResponse } from '@/features/auth/types/auth.types';
import api from '@/services/api';

export const authApi = {
    /** POST /auth/admin/login */
    login: async (payload: LoginRequest): Promise<LoginResponse> => {
        const { data } = await api.post<LoginResponse>('/auth/admin/login', payload);
        return data;
    },

    /** GET /auth/me — requires a valid access token in the Authorization header. */
    me: async (): Promise<MeResponse> => {
        const { data } = await api.get<MeResponse>('/auth/me');
        return data;
    },

    /** POST /auth/refresh — exchange a refresh token for a new token pair. */
    refresh: async (refreshToken: string): Promise<LoginResponse> => {
        const { data } = await api.post<LoginResponse>('/auth/refresh', { refreshToken });
        return data;
    },

    /**
     * Verify whether the current access token is still valid by calling /auth/me.
     * Returns `true` when the backend responds successfully, `false` otherwise.
     */
    verifyToken: async (): Promise<boolean> => {
        try {
            await api.get('/auth/me');
            return true;
        } catch {
            return false;
        }
    },

    /** PATCH /auth/password — change user password */
    changePassword: async (newPassword: string): Promise<{ success: boolean; message: string }> => {
        const { data } = await api.patch('/auth/password', { newPassword });
        return data;
    },
};
