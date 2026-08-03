import { z } from "zod";

export const updateProgramStatusSchema = z.object({
  isActive: z.boolean(),
});

export type UpdateProgramStatusDto = z.infer<typeof updateProgramStatusSchema>;
