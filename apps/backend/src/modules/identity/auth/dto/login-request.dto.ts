import { z } from "zod";

export const LoginRequestSchema = z.object({
  loginId: z
    .string()
    .trim()
    .min(1, "Login ID is required"),

  password: z
    .string()
    .min(1, "Password is required"),
});

export type LoginRequestDto = z.infer<typeof LoginRequestSchema>;
