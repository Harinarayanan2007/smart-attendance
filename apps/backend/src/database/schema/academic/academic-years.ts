import { boolean, date, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const academicYears = pgTable("academic_years", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: varchar("name", { length: 30 }).notNull().unique(),

  startDate: date("start_date").notNull(),

  endDate: date("end_date").notNull(),

  isCurrent: boolean("is_current").notNull().default(false),

  isActive: boolean("is_active").notNull().default(true),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),

  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
