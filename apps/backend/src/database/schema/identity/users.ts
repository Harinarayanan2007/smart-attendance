import {
    boolean,
    index,
    pgTable,
    text,
    timestamp,
    uniqueIndex,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";

import { roles } from "./roles.js";

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    roleId: uuid("role_id")
      .notNull()
      .references(() => roles.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),

    email: varchar("email", { length: 255 }).notNull(),

    passwordHash: text("password_hash").notNull(),

    isActive: boolean("is_active").notNull().default(true),

    lastLoginAt: timestamp("last_login_at", {
      withTimezone: true,
    }),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    usersEmailUnique: uniqueIndex("users_email_unique").on(table.email),

    usersRoleIdx: index("users_role_idx").on(table.roleId),
  })
);
