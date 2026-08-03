import { relations } from "drizzle-orm";

import { academicYears } from "./academic-years.js";
import { departments } from "./departments.js";
import { programs } from "./programs.js";

export const academicYearRelations = relations(academicYears, () => ({}));

export const departmentRelations = relations(departments, ({ many }) => ({
  programs: many(programs),
}));

export const programRelations = relations(programs, ({ one }) => ({
  department: one(departments, {
    fields: [programs.departmentId],
    references: [departments.id],
  }),
}));
