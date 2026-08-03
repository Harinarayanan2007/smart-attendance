import { z } from "zod";

import { paginationSchema } from "../../../shared/query/dto/pagination.dto.js";

export const findProgramsQuerySchema = paginationSchema.extend({
  search: z.string().trim().optional(),

  sort: z.enum(["name", "code", "createdAt"]).optional().default("name"),

  order: z.enum(["asc", "desc"]).optional().default("asc"),

  isActive: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .optional(),

  departmentId: z.string().uuid().optional(),
});

export type FindProgramsQueryDto = z.infer<typeof findProgramsQuerySchema>;
