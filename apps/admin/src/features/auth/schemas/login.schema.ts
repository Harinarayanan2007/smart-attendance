import { z } from 'zod';

export const loginSchema = z.object({
    loginId: z.string().trim().min(1, 'Email or Login ID is required'),
    password: z.string().trim().min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
