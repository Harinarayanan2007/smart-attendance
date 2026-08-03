import { seedRoles } from "./roles.js";
import { seedUsers } from "./users.js";

export async function seedIdentity() {
  await seedRoles();
  await seedUsers();
}
