import { z } from "zod";

export const createAcademicYearSchema = z
  .object({
    name: z.string().trim().min(1, "Academic year name is required."),
    startDate: z.string().min(1, "Start date is required."),
    endDate: z.string().min(1, "End date is required."),
    isCurrent: z.boolean().optional(),
    isActive: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
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
  });

export type CreateAcademicYearDto = z.infer<typeof createAcademicYearSchema>;
