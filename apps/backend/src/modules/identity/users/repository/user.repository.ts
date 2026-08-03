import type { InferModel } from "drizzle-orm";
import { eq } from "drizzle-orm";

import { db } from "../../../../database/client.js";
import { roles, users } from "../../../../database/schema/index.js";

export class UserRepository {
  async existsByEmail(email: string): Promise<boolean> {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    return !!user;
  }

  async findRoleByName(roleName: string) {
    return await db.query.roles.findFirst({
      where: eq(roles.name, roleName),
    });
  }

  async create(data: {
    email: string;
    passwordHash: string;
    roleId: string;
  }): Promise<InferModel<typeof users>> {
    const [user] = await db
      .insert(users)
      .values({
        email: data.email,
        passwordHash: data.passwordHash,
        roleId: data.roleId,
      })
      .returning();

    if (!user) {
      throw new Error("Failed to create user.");
    }

    return user;
  }

  async findAll() {
    return await db.query.users.findMany({
      with: {
        role: true,
      },
      orderBy: (users, { asc }) => [asc(users.email)],
    });
  }

  async findById(id: string) {
    return await db.query.users.findFirst({
      where: eq(users.id, id),
      with: {
        role: true,
      },
    });
  }

  async updateRole(
    userId: string,
    roleId: string,
  ) {
    const [user] = await db
      .update(users)
      .set({
        roleId,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    return user;
  }

  async updateStatus(
    userId: string,
    isActive: boolean,
  ) {
    const [user] = await db
      .update(users)
      .set({
        isActive,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    return user;
  }
}
