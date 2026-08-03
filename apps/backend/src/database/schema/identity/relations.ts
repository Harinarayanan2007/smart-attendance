import { relations } from "drizzle-orm";

import { roles } from "./roles.js";
import { users } from "./users.js";

export const usersRelations = relations(users, ({ one }) => ({
  role: one(roles, {
    fields: [users.roleId],
    references: [roles.id],
  }),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(users),
}));
