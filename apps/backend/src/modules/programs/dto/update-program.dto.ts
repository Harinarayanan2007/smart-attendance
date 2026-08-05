import { z } from "zod";

export const updateProgramSchema = z.object({
  name: z.string().trim().min(2, "Program name must be at least 2 characters.").max(255).optional(),

  code: z
    .string()
    .trim()
    .min(2)
    .max(50)
    .transform((value) => value.toUpperCase())
    .optional(),

  durationYears: z.number().int().min(1).max(8).optional(),

  description: z.string().trim().max(1000).optional(),
});

export type UpdateProgramDto = z.infer<typeof updateProgramSchema>;
