import { z } from "zod";

export const ChangePasswordRequestSchema = z.object({
  newPassword: z.string().min(8, "Password must be at least 8 characters").max(100),
});

export type ChangePasswordRequestDto = z.infer<typeof ChangePasswordRequestSchema>;
