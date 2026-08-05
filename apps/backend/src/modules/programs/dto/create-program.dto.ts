import { z } from "zod";

export const createProgramSchema = z.object({
  name: z.string().min(1, "Name is required.").max(255),
  code: z.string().min(1, "Code is required.").max(50),
  durationYears: z.number().int().min(1).max(10),
  description: z.string().max(1000).optional(),
  isActive: z.boolean().optional(),
});

export type CreateProgramDto = z.infer<typeof createProgramSchema>;
