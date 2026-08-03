import { seedAcademicYears } from "./academic-years.seed.js";
import { seedDepartments } from "./departments.seed.js";
import { seedPrograms } from "./programs.seed.js";

export async function seedAcademic()
{
    await seedAcademicYears();
    await seedDepartments();
    await seedPrograms();
}

