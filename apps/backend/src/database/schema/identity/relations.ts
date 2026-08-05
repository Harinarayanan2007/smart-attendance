import { relations } from "drizzle-orm";

import { roles } from "./roles.js";
import { users } from "./users.js";
import { departments } from "../academic/departments.js";
import { programs } from "../academic/programs.js";
import { batches } from "../academic/batches.js";

export const usersRelations = relations(users, ({ one }) => ({
  role: one(roles, {
    fields: [users.roleId],
    references: [roles.id],
  }),
  department: one(departments, {
    fields: [users.departmentId],
    references: [departments.id],
  }),
  program: one(programs, {
    fields: [users.programId],
    references: [programs.id],
  }),
  batch: one(batches, {
    fields: [users.batchId],
    references: [batches.id],
  }),
  creator: one(users, {
    fields: [users.createdBy],
    references: [users.id],
  }),
  updater: one(users, {
    fields: [users.updatedBy],
    references: [users.id],
  }),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(users),
}));
