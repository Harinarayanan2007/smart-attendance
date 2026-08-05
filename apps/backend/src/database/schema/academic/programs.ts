import {
    boolean,
    integer,
    pgTable,
    timestamp,
    uniqueIndex,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";

import { departments } from "./departments.js";

export const programs = pgTable(
  "programs",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    name: varchar("name", { length: 255 }).notNull(),

    code: varchar("code", { length: 50 }).notNull().unique(),

    durationYears: integer("duration_years").notNull(),

    description: varchar("description", { length: 1000 }),

    isActive: boolean("is_active").notNull().default(true),

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
    programNameUnique: uniqueIndex("programs_name_unique").on(table.name),
  }),
);
