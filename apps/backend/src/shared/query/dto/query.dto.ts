import { z } from "zod";

export const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),

  limit: z.coerce.number().min(1).max(100).default(10),

  search: z.string().trim().optional(),

  sort: z.string().optional(),

  order: z.enum(["asc", "desc"]).default("asc"),

  isActive: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .optional(),
});

export type QueryDto = z.infer<typeof querySchema>;
