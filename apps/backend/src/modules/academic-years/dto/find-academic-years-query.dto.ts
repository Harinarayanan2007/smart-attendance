import { z } from "zod";

import { paginationSchema } from "../../../shared/query/dto/pagination.dto.js";

export const findAcademicYearsQuerySchema = paginationSchema.extend({
  search: z.string().trim().optional(),
  sort: z.enum(["name", "startDate", "endDate", "createdAt"]).optional().default("name"),
  order: z.enum(["asc", "desc"]).optional().default("asc"),
  isActive: z.enum(["true", "false"]).transform((value) => value === "true").optional(),
  isCurrent: z.enum(["true", "false"]).transform((value) => value === "true").optional(),
});

export type FindAcademicYearsQueryDto = z.infer<typeof findAcademicYearsQuerySchema>;
