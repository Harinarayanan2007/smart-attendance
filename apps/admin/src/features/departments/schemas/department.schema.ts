import { z } from 'zod';

export const departmentSchema = z.object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters.').max(100, 'Name cannot exceed 100 characters.'),
    code: z
        .string()
        .trim()
        .min(2, 'Code must be at least 2 characters.')
        .max(50, 'Code cannot exceed 50 characters.')
        .transform((val) => val.toUpperCase()),
    description: z.string().max(1000, 'Description is too long.').optional().nullable(),
    isActive: z.boolean().default(true).optional(),
});

export type DepartmentFormValues = z.infer<typeof departmentSchema>;
