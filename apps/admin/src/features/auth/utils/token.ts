/**
 * Client-side JWT utilities.
 *
 * These decode the token payload WITHOUT cryptographic verification —
 * actual verification happens on the backend. The helpers here are used
 * only for expiration checks and extracting claims for UI purposes.
 */

interface JwtPayload {
    userId: string;
    role: string;
    exp?: number;
    iat?: number;
}

/**
 * Decode a JWT payload (base-64-url → JSON).
 * Returns `null` when the token is malformed.
 */
export function getTokenPayload(token: string): JwtPayload | null {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const json = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join(''),
        );
        return JSON.parse(json) as JwtPayload;
    } catch {
        return null;
    }
}

/**
 * Returns `true` when the token's `exp` claim is in the past
 * (or the token is unparseable).
 */
export function isTokenExpired(token: string): boolean {
    const payload = getTokenPayload(token);
    if (!payload?.exp) return true;
    // Compare with a 30-second buffer to account for clock skew
    return Date.now() >= payload.exp * 1000 - 30_000;
}

/**
 * Returns the expiration date embedded in the token, or `null`.
 */
export function getTokenExpirationDate(token: string): Date | null {
    const payload = getTokenPayload(token);
    if (!payload?.exp) return null;
    return new Date(payload.exp * 1000);
}
