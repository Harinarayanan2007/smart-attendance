import { z } from "zod";

export const updateAcademicYearStatusSchema = z.object({
  isActive: z.boolean(),
});

export type UpdateAcademicYearStatusDto = z.infer<typeof updateAcademicYearStatusSchema>;
