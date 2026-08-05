import { eq, or } from "drizzle-orm";

import { db } from "../../../../database/client.js";
import { roles, users } from "../../../../database/schema/index.js";

export class AuthRepository {
  async findUserByLoginId(loginId: string) {
  const [result] = await db
    .select({
      id: users.id,
      loginId: users.loginId,
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
    .where(or(eq(users.loginId, loginId), eq(users.email, loginId)));

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

  async updatePassword(id: string, passwordHash: string) {
    await db
      .update(users)
      .set({
        passwordHash,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id));
  }
}
