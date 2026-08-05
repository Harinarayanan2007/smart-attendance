import { ROUTES } from '@/constants';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { useAuthStore } from '@/store/auth-store';
import { Navigate } from 'react-router-dom';

export function LoginPage() {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

    // If already logged in, redirect straight to the dashboard.
    if (isAuthenticated) {
        return <Navigate to={ROUTES.dashboard} replace />;
    }

    return (
        <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-panel lg:p-10">
            <LoginForm />

            {/* Version footer */}
            <p className="mt-6 text-center text-xs text-muted-foreground">
                {import.meta.env.VITE_APP_NAME ?? 'Smart Attendance Admin'} v{import.meta.env.VITE_APP_VERSION ?? '0.1.0'}
            </p>
        </div>
    );
}
