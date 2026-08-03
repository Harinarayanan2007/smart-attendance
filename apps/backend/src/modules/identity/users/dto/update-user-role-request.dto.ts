import { z } from "zod";

export const UpdateUserRoleRequestSchema = z.object({
  role: z
    .string()
    .trim()
    .min(1, "Role is required"),
});

export type UpdateUserRoleRequestDto =
  z.infer<typeof UpdateUserRoleRequestSchema>;
