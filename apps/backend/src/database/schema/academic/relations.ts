import { relations } from "drizzle-orm";

import { batches } from "./batches.js";
import { departments } from "./departments.js";
import { programs } from "./programs.js";

export const batchRelations = relations(batches, () => ({}));

export const departmentRelations = relations(departments, () => ({}));

export const programRelations = relations(programs, () => ({}));
