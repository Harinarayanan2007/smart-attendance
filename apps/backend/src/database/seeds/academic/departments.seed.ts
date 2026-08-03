import { db } from "../../client.js";
import { departments } from "../../schema/index.js";

export async function seedDepartments() {
    const existing = await db.query.departments.findMany();

    if (existing.length > 0) {
        console.log("Departments already seeded.");
        return;
    }

    await db.insert(departments).values([
        {
            name: "Computer Science and Engineering",
            code: "CSE",
            description: "Computer Science Department",
        },
        {
            name: "Information Technology",
            code: "IT",
            description: "Information Technology Department",
        },
        {
            name: "Electronics and Communication Engineering",
            code: "ECE",
            description: "Electronics Department",
        },
        {
            name: "Mechanical Engineering",
            code: "ME",
            description: "Mechanical Department",
        },
    ]);

    console.log("Departments seeded successfully.");
}
