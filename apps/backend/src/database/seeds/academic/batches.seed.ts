import { db } from "../../client.js";
import { batches, programs } from "../../schema/index.js";
import { eq } from "drizzle-orm";

export async function seedBatches() {
  const existing = await db.query.batches.findMany();

  if (existing.length > 0) {
    console.log("Batches already seeded.");
    return;
  }

  // Find a program to attach the batches to (not needed anymore, but keeping structure)

  await db.insert(batches).values([
    {
      name: "2024-2028",
      startYear: 2024,
      endYear: 2028,
      isActive: true,
    },
    {
      name: "2025-2029",
      startYear: 2025,
      endYear: 2029,
      isActive: true,
    },
  ]);

  console.log("Batches seeded successfully.");
}
