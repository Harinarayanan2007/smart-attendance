import { z } from "zod";

export const updateAcademicYearSchema = z
  .object({
    name: z.string().trim().min(1, "Academic year name is required.").optional(),
    startDate: z.string().min(1, "Start date is required.").optional(),
    endDate: z.string().min(1, "End date is required.").optional(),
    isCurrent: z.boolean().optional(),
    isActive: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.startDate && data.endDate) {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);

      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Dates must be valid ISO date strings.",
          path: ["startDate"],
        });
        return;
      }

      if (end <= start) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "End date must be greater than start date.",
          path: ["endDate"],
        });
      }
    }
  });

export type UpdateAcademicYearDto = z.infer<typeof updateAcademicYearSchema>;
