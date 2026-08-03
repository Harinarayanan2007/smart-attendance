import { z } from "zod";

export const CreateUserRequestSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100),

  role: z
    .string()
    .trim()
    .min(1, "Role is required"),
});

export type CreateUserRequestDto =
  z.infer<typeof CreateUserRequestSchema>;
