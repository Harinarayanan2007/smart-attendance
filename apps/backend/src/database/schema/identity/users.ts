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
import { departments } from "../academic/departments.js";
import { programs } from "../academic/programs.js";
import { batches } from "../academic/batches.js";

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

    // Made notNull after migration
    name: varchar("name", { length: 255 }).notNull(),

    loginId: varchar("login_id", { length: 255 }).notNull().unique(),

    registerNumber: varchar("register_number", { length: 255 }).unique(),

    employeeId: varchar("employee_id", { length: 255 }).unique(),

    avatarUrl: text("avatar_url"),

    phone: varchar("phone", { length: 50 }),

    departmentId: uuid("department_id").references(() => departments.id, {
      onDelete: "set null",
    }),

    programId: uuid("program_id").references(() => programs.id, {
      onDelete: "set null",
    }),

    batchId: uuid("batch_id").references(() => batches.id, {
      onDelete: "set null",
    }),

    email: varchar("email", { length: 255 }).notNull(),

    passwordHash: text("password_hash").notNull(),


    isActive: boolean("is_active").notNull().default(true),

    lastLoginAt: timestamp("last_login_at", {
      withTimezone: true,
    }),

    // Using any type hack to reference the table itself before it's fully defined if necessary,
    // but in Drizzle, arrow functions usually solve this.
    // However, if we need to reference `users.id`, we can do it inside the object since it's lazy.
    // Wait, Drizzle allows referencing itself like so:
    createdBy: uuid("created_by"),
    
    updatedBy: uuid("updated_by"),

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
