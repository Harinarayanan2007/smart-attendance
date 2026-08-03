import { z } from "zod";

export const createProgramSchema = z.object({
  departmentId: z.string().uuid("Department id must be a valid UUID."),

  name: z.string().trim().min(2, "Program name must be at least 2 characters.").max(255),

  code: z
    .string()
    .trim()
    .min(2)
    .max(50)
    .transform((value) => value.toUpperCase()),

  durationYears: z.number().int().min(1).max(8),

  description: z.string().trim().max(1000).optional(),
});

export type CreateProgramDto = z.infer<typeof createProgramSchema>;
