import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useLogin } from '@/features/auth/hooks/useLogin';
import { loginSchema, type LoginFormValues } from '@/features/auth/schemas/login.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export function LoginForm() {
    const { login, isLoading, error: serverError } = useLogin();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        mode: 'onChange',
        defaultValues: { loginId: '', password: '' },
    });

    const onSubmit = async (values: LoginFormValues) => {
        await login(values);
    };

    return (
        <Card className="w-full max-w-md p-8">
            <div className="mb-6 text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Sign in</p>
                <h1 className="mt-2 text-2xl font-semibold text-foreground">Smart Attendance Admin</h1>
                <p className="mt-2 text-sm text-muted-foreground">Use your admin credentials to continue.</p>
            </div>

            {/* Server error banner */}
            {serverError ? (
                <div
                    role="alert"
                    className="mb-4 flex items-start gap-2 rounded-lg border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-400"
                >
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{serverError.message}</span>
                </div>
            ) : null}

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
                <div>
                    <label className="mb-1 block text-sm font-medium text-foreground" htmlFor="login-id">
                        Email or Login ID
                    </label>
                    <Input
                        id="login-id"
                        autoFocus
                        type="text"
                        autoComplete="username"
                        placeholder="admin@example.com or 24IT001"
                        aria-invalid={!!errors.loginId}
                        aria-describedby={errors.loginId ? 'login-id-error' : undefined}
                        {...register('loginId')}
                    />
                    {errors.loginId ? (
                        <p id="login-id-error" className="mt-1 text-sm text-rose-600 dark:text-rose-400" role="alert">
                            {errors.loginId.message}
                        </p>
                    ) : null}
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-foreground" htmlFor="login-password">
                        Password
                    </label>
                    <div className="relative">
                        <Input
                            id="login-password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="current-password"
                            placeholder="Enter password"
                            aria-invalid={!!errors.password}
                            aria-describedby={errors.password ? 'login-password-error' : undefined}
                            {...register('password')}
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                            onClick={() => setShowPassword((value) => !value)}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                    {errors.password ? (
                        <p id="login-password-error" className="mt-1 text-sm text-rose-600 dark:text-rose-400" role="alert">
                            {errors.password.message}
                        </p>
                    ) : null}
                </div>

                <Button id="login-submit" type="submit" className="w-full" disabled={!isValid || isLoading}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    {isLoading ? 'Signing in...' : 'Sign in'}
                </Button>
            </form>
        </Card>
    );
}
