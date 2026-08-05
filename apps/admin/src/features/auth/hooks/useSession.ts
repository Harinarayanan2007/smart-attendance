import { useAuthStore } from '@/store/auth-store';
import { useEffect, useState } from 'react';

interface SessionState {
    /** `true` once the initial session check has completed. */
    isReady: boolean;
    isAuthenticated: boolean;
}

/**
 * Handles session initialisation on application startup.
 *
 * Zustand `persist` rehydrates the store asynchronously from localStorage.
 * Once that's done we run `initialize()` which validates the persisted
 * token and either keeps or clears the session.
 *
 * Components should gate rendering on `isReady` to avoid flash-of-content.
 */
export function useSession(): SessionState {
    const initialize = useAuthStore((s) => s.initialize);
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const accessToken = useAuthStore((s) => s.accessToken);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // Zustand persist rehydrates synchronously in most cases,
        // but we wrap in a micro-task to be safe.
        const id = requestAnimationFrame(() => {
            initialize();
            setIsReady(true);
        });
        return () => cancelAnimationFrame(id);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return {
        isReady,
        isAuthenticated: isReady ? isAuthenticated && !!accessToken : false,
    };
}
