import { seedAcademic } from "./academic/index.js";
import { seedIdentity } from "./identity/index.js";

async function main() {
  try {
    console.log("🌱 Starting database seeding...");

    await seedIdentity();
    await seedAcademic();

    console.log("✅ Database seeding completed successfully.");
  } catch (error) {
    console.error("❌ Database seeding failed.");
    console.error(error);
    process.exit(1);
  }

  process.exit(0);
}

void main();
