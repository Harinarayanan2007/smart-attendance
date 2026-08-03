import { z } from "zod";

export const UpdateUserStatusRequestSchema = z.object({
  isActive: z.boolean(),
});

export type UpdateUserStatusRequestDto =
  z.infer<typeof UpdateUserStatusRequestSchema>;
