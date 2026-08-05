import { z } from 'zod';

export const createProgramSchema = z.object({
    name: z
        .string()
        .min(2, 'Program name must be at least 2 characters.')
        .max(255, 'Program name cannot exceed 255 characters.')
        .trim(),
    code: z
        .string()
        .min(2, 'Program code must be at least 2 characters.')
        .max(50, 'Program code cannot exceed 50 characters.')
        .trim()
        .toUpperCase(),
    durationYears: z.coerce.number().min(1, 'Duration must be at least 1 year.').max(10, 'Duration cannot exceed 10 years.'),
    description: z
        .string()
        .max(1000, 'Description cannot exceed 1000 characters.')
        .optional()
        .nullable(),
    isActive: z.boolean().default(true),
});

export type ProgramFormValues = z.infer<typeof createProgramSchema>;
