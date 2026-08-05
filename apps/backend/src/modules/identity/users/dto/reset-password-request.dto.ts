import { z } from "zod";

export const ResetPasswordRequestSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
});

export type ResetPasswordRequestDto = z.infer<typeof ResetPasswordRequestSchema>;
