import { z } from "zod";

export const UpdateUserPasswordRequestSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters").max(100),
});

export type UpdateUserPasswordRequestDto = z.infer<typeof UpdateUserPasswordRequestSchema>;
