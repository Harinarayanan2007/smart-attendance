import { z } from "zod";

export const createBatchSchema = z.object({
  name: z.string().min(1, "Name is required.").max(50, "Name must be less than 50 characters.").optional(),
  startYear: z.number().int().min(2000).max(2100),
  isActive: z.boolean().optional(),
});

export type CreateBatchDto = z.infer<typeof createBatchSchema>;
