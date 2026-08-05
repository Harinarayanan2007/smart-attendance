import { z } from "zod";

export const updateBatchSchema = z.object({
  startYear: z.number().int().min(2000).max(2100).optional(),
  isActive: z.boolean().optional(),
});

export type UpdateBatchDto = z.infer<typeof updateBatchSchema>;
