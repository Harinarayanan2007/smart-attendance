/** Roles matching the backend identity module (uppercase convention). */
export type UserRole = 'ADMIN' | 'FACULTY' | 'STUDENT';

/** Payload sent to POST /auth/login. */
export interface LoginRequest {
    loginId: string;
    password: string;
}

/** User object returned inside LoginResponse. */
export interface AuthUser {
    id: string;
    loginId: string;
    role: UserRole;
    isActive: boolean;
}

/** Full response from POST /auth/login. */
export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: AuthUser;
}

/** Response shape from GET /auth/me (authenticated). */
export interface MeResponse {
    success: boolean;
    data: {
        userId: string;
        role: string;
    };
    timestamp: string;
}

/** Normalised authentication error surfaced to the UI. */
export interface AuthError {
    status?: number;
    message: string;
    code?: string;
}
