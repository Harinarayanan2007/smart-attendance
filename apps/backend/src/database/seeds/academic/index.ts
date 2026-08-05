import { seedBatches } from "./batches.seed.js";
import { seedDepartments } from "./departments.seed.js";
import { seedPrograms } from "./programs.seed.js";

export async function seedAcademic()
{
    await seedDepartments();
    await seedPrograms();
    await seedBatches();
}

