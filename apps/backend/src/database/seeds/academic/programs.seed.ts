import { db } from "../../client.js";
import { programs } from "../../schema/index.js";

export async function seedPrograms() {
  const existing = await db.query.programs.findMany();

  if (existing.length > 0) {
    console.log("Programs already seeded.");
    return;
  }

  const departments = await db.query.departments.findMany();

  const departmentMap = new Map(departments.map((department) => [department.code, department.id]));

  const programSeedData = [
    {
      departmentCode: "CSE",
      name: "B.Tech CSE",
      code: "BTECHCSE",
      durationYears: 4,
      description: "Bachelor of Technology in Computer Science",
    },
    {
      departmentCode: "CSE",
      name: "M.Tech CSE",
      code: "MTECHCSE",
      durationYears: 2,
      description: "Master of Technology in Computer Science",
    },
    {
      departmentCode: "ECE",
      name: "B.Tech ECE",
      code: "BTECHECE",
      durationYears: 4,
      description: "Bachelor of Technology in Electronics",
    },
    {
      departmentCode: "ME",
      name: "B.Tech ME",
      code: "BTECHME",
      durationYears: 4,
      description: "Bachelor of Technology in Mechanical Engineering",
    },
    {
      departmentCode: "IT",
      name: "B.Tech IT",
      code: "BTECHIT",
      durationYears: 4,
      description: "Bachelor of Technology in Information Technology",
    },
    {
      departmentCode: "IT",
      name: "MBA",
      code: "MBA",
      durationYears: 2,
      description: "Master of Business Administration",
    },
  ];

  const values = programSeedData
    .map((program) => {
      const departmentId = departmentMap.get(program.departmentCode);
      if (!departmentId) {
        return null;
      }

      return {
        departmentId,
        name: program.name,
        code: program.code,
        durationYears: program.durationYears,
        description: program.description,
      };
    })
    .filter((value): value is NonNullable<typeof value> => value !== null);

  if (values.length > 0) {
    await db.insert(programs).values(values);
  }

  console.log("Programs seeded successfully.");
}
