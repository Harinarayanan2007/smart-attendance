import { z } from "zod";

import { paginationSchema } from "../../../shared/query/dto/pagination.dto.js";

export const findBatchesQuerySchema = paginationSchema.extend({
  search: z.string().trim().optional(),
  sort: z.enum(["name", "startYear", "endYear", "code", "createdAt"]).optional().default("name"),
  order: z.enum(["asc", "desc"]).optional().default("asc"),
  isActive: z.preprocess((val) => {
    if (val === 'true') return true;
    if (val === 'false') return false;
    return val;
  }, z.boolean().optional()),
});

export type FindBatchesQueryDto = z.infer<typeof findBatchesQuerySchema>;
