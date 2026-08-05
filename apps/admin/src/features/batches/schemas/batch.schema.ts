import { z } from 'zod';

export const batchSchema = z.object({
    startYear: z.coerce.number({
        required_error: 'Start year is required',
    }).min(2000, 'Invalid year').max(2100, 'Invalid year'),
    isActive: z.boolean().default(true),
});

export type BatchFormValues = z.infer<typeof batchSchema>;
