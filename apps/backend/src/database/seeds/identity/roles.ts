import { ROLES } from "../../../config/constants.js";
import { logger } from "../../../config/logger.js";
import { db } from "../../client.js";
import { roles } from "../../schema/identity/roles.js";

export async function seedRoles() {
  const inserted = await db
    .insert(roles)
    .values([
      {
        name: ROLES.ADMIN,
        description: "System Administrator",
      },
      {
        name: ROLES.STAFF,
        description: "Teaching Staff",
      },
      {
        name: ROLES.STUDENT,
        description: "Student",
      },
    ])
    .onConflictDoNothing()
    .returning();

  logger.info(
    `Roles seed completed. Inserted ${inserted.length} new role(s).`
  );
}
