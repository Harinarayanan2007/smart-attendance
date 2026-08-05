import { boolean, integer, pgTable, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";
import { programs } from "./programs.js";

export const batches = pgTable("batches", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: varchar("name", { length: 50 }).notNull(),

  startYear: integer("start_year").notNull(),

  endYear: integer("end_year").notNull(),

  isActive: boolean("is_active").notNull().default(true),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),

  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  batchStartUnique: uniqueIndex("batches_start_unique").on(table.startYear),
}));
