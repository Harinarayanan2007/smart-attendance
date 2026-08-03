import { z } from "zod";

export const createDepartmentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Department name must be at least 2 characters.")
    .max(255),

  code: z
    .string()
    .trim()
    .min(2)
    .max(50)
    .transform((value) => value.toUpperCase()),

  description: z
    .string()
    .trim()
    .max(1000)
    .optional(),
});

export type CreateDepartmentDto = z.infer<typeof createDepartmentSchema>;
