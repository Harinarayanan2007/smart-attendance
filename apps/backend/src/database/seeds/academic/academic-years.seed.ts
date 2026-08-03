import { db } from "../../client.js";
import { academicYears } from "../../schema/index.js";

export async function seedAcademicYears() {
  const existing = await db.query.academicYears.findMany();

  if (existing.length > 0) {
    console.log("Academic years already seeded.");
    return;
  }

  await db.insert(academicYears).values([
    {
      name: "2025-2026",
      startDate: "2025-06-01",
      endDate: "2026-05-31",
      isCurrent: false,
      isActive: true,
    },
    {
      name: "2026-2027",
      startDate: "2026-06-01",
      endDate: "2027-05-31",
      isCurrent: true,
      isActive: true,
    },
    {
      name: "2027-2028",
      startDate: "2027-06-01",
      endDate: "2028-05-31",
      isCurrent: false,
      isActive: true,
    },
  ]);

  console.log("Academic years seeded successfully.");
}
