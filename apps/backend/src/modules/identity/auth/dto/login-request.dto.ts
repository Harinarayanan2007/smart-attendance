import { z } from "zod";

export const LoginRequestSchema = z.object({
  email: z
    .email("Invalid email address")
    .trim()
    .toLowerCase(),

  password: z
    .string()
    .min(1, "Password is required"),
});

export type LoginRequestDto = z.infer<typeof LoginRequestSchema>;
