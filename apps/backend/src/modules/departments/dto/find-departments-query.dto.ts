import { z } from "zod";

import { paginationSchema } from "../../../shared/query/dto/pagination.dto.js";

export const findDepartmentsQuerySchema = paginationSchema.extend({
  search: z.string().trim().optional(),

  sort: z.enum(["name", "code", "createdAt"]).optional().default("name"),

  order: z.enum(["asc", "desc"]).optional().default("asc"),

  isActive: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .optional(),
});

export type FindDepartmentsQueryDto = z.infer<typeof findDepartmentsQuerySchema>;
