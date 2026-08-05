import type { AuthUser, UserRole } from '@/features/auth/types/auth.types';
import { useAuthStore } from '@/store/auth-store';

interface CurrentUser {
    user: AuthUser | null;
    isAuthenticated: boolean;
    role: UserRole | null;
}

/**
 * Convenience hook for reading the current user from the auth store.
 */
export function useCurrentUser(): CurrentUser {
    const user = useAuthStore((s) => s.user);
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

    return {
        user,
        isAuthenticated,
        role: user?.role ?? null,
    };
}
