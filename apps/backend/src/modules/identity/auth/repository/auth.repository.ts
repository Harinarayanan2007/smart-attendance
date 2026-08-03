import { eq } from "drizzle-orm";

import { db } from "../../../../database/client.js";
import { roles, users } from "../../../../database/schema/index.js";

export class AuthRepository {
  async findUserByEmail(email: string) {
  const [result] = await db
    .select({
      id: users.id,
      email: users.email,
      passwordHash: users.passwordHash,
      isActive: users.isActive,
      lastLoginAt: users.lastLoginAt,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,

      role: {
        id: roles.id,
        name: roles.name,
      },
    })
    .from(users)
    .innerJoin(roles, eq(users.roleId, roles.id))
    .where(eq(users.email, email));

  return result ?? null;
}

  async findUserById(id: string) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id));

    return user ?? null;
  }

  async updateLastLogin(id: string) {
    await db
      .update(users)
      .set({
        lastLoginAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(users.id, id));
  }
}
