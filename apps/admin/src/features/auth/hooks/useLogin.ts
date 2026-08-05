import { ROUTES } from '@/constants';
import type { LoginFormValues } from '@/features/auth/schemas/login.schema';
import { useAuthStore } from '@/store/auth-store';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Encapsulates the login flow: call the store action, navigate on success.
 */
export function useLogin() {
    const navigate = useNavigate();
    const login = useAuthStore((s) => s.login);
    const isLoading = useAuthStore((s) => s.isLoading);
    const error = useAuthStore((s) => s.error);
    const setError = useAuthStore((s) => s.setError);

    const handleLogin = useCallback(
        async (values: LoginFormValues) => {
            try {
                setError(null);
                await login(values);
                navigate(ROUTES.dashboard, { replace: true });
            } catch {
                // Error already surfaced through the store's error state + toast.
            }
        },
        [login, navigate, setError],
    );

    return { login: handleLogin, isLoading, error } as const;
}
