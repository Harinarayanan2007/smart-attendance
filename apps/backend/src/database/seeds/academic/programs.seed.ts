import { db } from "../../client.js";
import { programs } from "../../schema/index.js";

export async function seedPrograms() {
  const existing = await db.query.programs.findMany();

  if (existing.length > 0) {
    console.log("Programs already seeded.");
    return;
  }

  await db.insert(programs).values([
    {
      name: "Bachelor of Engineering",
      code: "BE",
      durationYears: 4,
      description: "Undergraduate Engineering Program",
      isActive: true,
    },
    {
      name: "Bachelor of Technology",
      code: "BTECH",
      durationYears: 4,
      description: "Undergraduate Technology Program",
      isActive: true,
    },
    {
      name: "Master of Engineering",
      code: "ME",
      durationYears: 2,
      description: "Postgraduate Engineering Program",
      isActive: true,
    },
    {
      name: "Master of Technology",
      code: "MTECH",
      durationYears: 2,
      description: "Postgraduate Technology Program",
      isActive: true,
    },
  ]);

  console.log("Programs seeded successfully.");
}
