import { boolean, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const departments = pgTable("departments", {
    id: uuid("id").defaultRandom().primaryKey(),

    name: varchar("name", { length: 255 }).notNull(),

    code: varchar("code", { length: 50 }).notNull().unique(),

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
});
