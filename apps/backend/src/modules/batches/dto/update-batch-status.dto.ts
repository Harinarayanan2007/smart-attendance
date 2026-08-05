import { z } from "zod";

export const updateBatchStatusSchema = z.object({
  isActive: z.boolean(),
});

export type UpdateBatchStatusDto = z.infer<typeof updateBatchStatusSchema>;
