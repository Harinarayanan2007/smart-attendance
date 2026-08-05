import { ROUTES } from '@/constants';
import { useAuthStore } from '@/store/auth-store';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Encapsulates the logout flow: clear store, clear React Query cache,
 * and navigate to the login page.
 */
export function useLogout() {
    const navigate = useNavigate();
    const logout = useAuthStore((s) => s.logout);
    const queryClient = useQueryClient();

    const handleLogout = useCallback(() => {
        queryClient.clear();
        logout();
        navigate(ROUTES.login, { replace: true });
    }, [logout, navigate, queryClient]);

    return { logout: handleLogout } as const;
}
