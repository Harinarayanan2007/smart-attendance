import { z } from "zod";

export const updateDepartmentStatusSchema = z.object({
  isActive: z.boolean(),
});

export type UpdateDepartmentStatusDto =
  z.infer<typeof updateDepartmentStatusSchema>;
