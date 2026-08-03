import { z } from "zod";

export const updateDepartmentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2)
    .max(255)
    .optional(),

  code: z
    .string()
    .trim()
    .min(2)
    .max(50)
    .transform((value) => value.toUpperCase())
    .optional(),

  description: z
    .string()
    .trim()
    .max(1000)
    .optional(),
});

export type UpdateDepartmentDto = z.infer<typeof updateDepartmentSchema>;
