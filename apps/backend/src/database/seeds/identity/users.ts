import { eq } from "drizzle-orm";

import { hashPassword } from "../../../modules/identity/auth/utils/password.js";
import { db } from "../../client.js";
import { roles, users } from "../../schema/index.js";

const DEFAULT_ADMIN = {
  email: "admin@example.com",
  password: "Admin@123",
};

export async function seedUsers(): Promise<void> {
  console.log("🌱 Seeding admin user...");

  // Find the ADMIN role
  const [adminRole] = await db
    .select()
    .from(roles)
    .where(eq(roles.name, "ADMIN"))
    .limit(1);

  if (!adminRole) {
    throw new Error(
      "ADMIN role not found. Please run the roles seed before seeding users."
    );
  }

  // Check if the admin user already exists
  const [existingAdmin] = await db
    .select()
    .from(users)
    .where(eq(users.email, DEFAULT_ADMIN.email))
    .limit(1);

  if (existingAdmin) {
    console.log("ℹ️ Admin user already exists. Skipping...");
    return;
  }

  // Hash the password
  const passwordHash = await hashPassword(DEFAULT_ADMIN.password);

  // Insert the admin user
  await db.insert(users).values({
    roleId: adminRole.id,
    email: DEFAULT_ADMIN.email,
    passwordHash,
    isActive: true,
    lastLoginAt: null,
  });

  console.log("✅ Admin user seeded successfully.");
}
