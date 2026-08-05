import { STORAGE_KEYS } from '@/constants';
import { isTokenExpired } from '@/features/auth/utils/token';

/**
 * Remove every auth-related key from storage.
 * Called during logout and on unrecoverable 401s.
 */
export function clearSession(): void {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(STORAGE_KEYS.auth);
}

/**
 * Quick client-side check: is the session likely valid?
 * This is NOT a replacement for server-side verification — it simply
 * prevents unnecessary API calls with an obviously-expired token.
 */
export function isSessionValid(accessToken: string | null): boolean {
    if (!accessToken) return false;
    return !isTokenExpired(accessToken);
}
