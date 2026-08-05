import { and, asc, desc, eq, ilike, ne, or } from "drizzle-orm";
import { db } from "../../../../database/client.js";
import { roles, users, departments, batches, programs } from "../../../../database/schema/index.js";
import type { CreateUserRequestDto } from "../dto/create-user-request.dto.js";

export class UserRepository {
  async existsByEmail(email: string): Promise<boolean> {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    return !!user;
  }

  async existsByLoginId(loginId: string, excludeUserId?: string): Promise<boolean> {
    const conditions = [eq(users.loginId, loginId)];
    if (excludeUserId) {
      conditions.push(ne(users.id, excludeUserId));
    }
    const user = await db.query.users.findFirst({
      where: and(...conditions),
    });
    return !!user;
  }

  async findRoleByName(roleName: string) {
    return await db.query.roles.findFirst({
      where: eq(roles.name, roleName),
    });
  }

  async findDepartmentById(id: string) {
    return await db.query.departments.findFirst({
      where: eq(departments.id, id),
    });
  }

  async findBatchById(id: string) {
    return await db.query.batches.findFirst({
      where: eq(batches.id, id),
    });
  }

  async findProgramById(id: string) {
    return await db.query.programs.findFirst({
      where: eq(programs.id, id),
    });
  }

  async getNextSequence(prefix: string, type: "STUDENT" | "FACULTY" | "ADMIN") {
    let col;
    if (type === "STUDENT") col = users.registerNumber;
    else if (type === "FACULTY") col = users.employeeId;
    else col = users.loginId;

    const results = await db
      .select({ val: col })
      .from(users)
      .where(ilike(col, `${prefix}%`))
      .orderBy(desc(col))
      .limit(1);

    if (results.length > 0 && results[0]?.val) {
      const maxVal = results[0].val as string;
      const numPart = maxVal.substring(prefix.length);
      const num = parseInt(numPart, 10);
      if (!isNaN(num)) {
        return `${prefix}${String(num + 1).padStart(3, "0")}`;
      }
    }
    return `${prefix}001`;
  }

  async create(data: {
    email: string;
    passwordHash: string;
    roleId: string;
    name: string;
    loginId: string;
    registerNumber?: string | null | undefined;
    employeeId?: string | null | undefined;
    phone?: string | null | undefined;
    avatarUrl?: string | null | undefined;
    departmentId?: string | null | undefined;
    programId?: string | null | undefined;
    batchId?: string | null | undefined;
    createdBy?: string | null | undefined;
  }) {
    const [user] = await db
      .insert(users)
      .values({
        email: data.email,
        passwordHash: data.passwordHash,
        roleId: data.roleId,
        name: data.name,
        loginId: data.loginId,
        registerNumber: data.registerNumber,
        employeeId: data.employeeId,
        phone: data.phone,
        avatarUrl: data.avatarUrl,
        departmentId: data.departmentId,
        programId: data.programId,
        batchId: data.batchId,
        createdBy: data.createdBy,
      })
      .returning();

    if (!user) {
      throw new Error("Failed to create user.");
    }
    return user;
  }

  async findAll(options?: {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
    order?: "asc" | "desc";
    role?: string;
    isActive?: boolean;
    departmentId?: string;
    programId?: string;
    batchId?: string;
  }) {
    const {
      page = 1,
      limit = 10,
      search,
      sort = "name",
      order = "asc",
      role,
      isActive,
      departmentId,
      programId,
      batchId,
    } = options ?? {};

    const conditions = [];

    if (search) {
      conditions.push(
        or(
          ilike(users.name, `%${search}%`),
          ilike(users.email, `%${search}%`)
        )
      );
    }

    if (role) {
      const roleRecord = await this.findRoleByName(role);
      if (roleRecord) {
        conditions.push(eq(users.roleId, roleRecord.id));
      }
    }

    if (typeof isActive === "boolean") {
      conditions.push(eq(users.isActive, isActive));
    }

    if (departmentId) {
      conditions.push(eq(users.departmentId, departmentId));
    }
    
    if (programId) {
      conditions.push(eq(users.programId, programId));
    }

    if (batchId) {
      conditions.push(eq(users.batchId, batchId));
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const sortColumn =
      sort === "email" ? users.email
        : sort === "createdAt" ? users.createdAt
        : users.name;

    const [rows, totalCountRows] = await Promise.all([
      db.query.users.findMany({
        where,
        orderBy: order === "desc" ? desc(sortColumn) : asc(sortColumn),
        limit,
        offset: (page - 1) * limit,
        with: {
          role: true,
          department: { columns: { name: true } },
          program: { columns: { name: true } },
          batch: { columns: { name: true } },
        },
      }),
      db.query.users.findMany({ where, columns: { id: true } })
    ]);

    return {
      data: rows,
      total: totalCountRows.length,
    };
  }

  async findById(id: string) {
    return await db.query.users.findFirst({
      where: eq(users.id, id),
      with: {
        role: true,
        department: { columns: { name: true } },
        program: { columns: { name: true } },
        batch: { columns: { name: true } },
        creator: { columns: { name: true } },
        updater: { columns: { name: true } },
      },
    });
  }

  async update(id: string, data: {
    name?: string | undefined;
    phone?: string | null | undefined;
    avatarUrl?: string | null | undefined;
    departmentId?: string | null | undefined;
    programId?: string | null | undefined;
    batchId?: string | null | undefined;
    roleId?: string | undefined;
    updatedBy?: string | null | undefined;
  }) {
    const [user] = await db
      .update(users)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();

    return user;
  }

  async updateRole(userId: string, roleId: string) {
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

  async updateStatus(userId: string, isActive: boolean) {
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

  async updatePassword(userId: string, passwordHash: string) {
    const [user] = await db
      .update(users)
      .set({
        passwordHash,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateAdmissionId(userId: string, data: { loginId: string; registerNumber: string; passwordHash?: string | undefined }) {
    const updateData: any = {
      loginId: data.loginId,
      registerNumber: data.registerNumber,
      updatedAt: new Date(),
    };
    
    if (data.passwordHash) {
      updateData.passwordHash = data.passwordHash;
    }

    const [user] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning();
    
    return user;
  }

  async getOptions() {
    return db.query.users.findMany({
      columns: {
        id: true,
        name: true,
      },
      where: eq(users.isActive, true),
      orderBy: [asc(users.name)],
    });
  }

  async getStatistics() {
    const allUsers = await db.query.users.findMany({
      columns: {
        id: true,
        isActive: true,
        departmentId: true,
        programId: true,
      },
      with: {
        role: {
          columns: {
            name: true
          }
        }
      }
    });

    const totalUsers = allUsers.length;
    const active = allUsers.filter(u => u.isActive).length;
    const inactive = totalUsers - active;
    
    let admins = 0;
    let faculty = 0;
    let students = 0;

    allUsers.forEach(u => {
      if (u.role?.name === 'ADMIN') admins++;
      if (u.role?.name === 'FACULTY') faculty++;
      if (u.role?.name === 'STUDENT') students++;
    });

    const departmentCount = new Set(allUsers.filter(u => u.departmentId).map(u => u.departmentId)).size;
    const programCount = new Set(allUsers.filter(u => u.programId).map(u => u.programId)).size;

    return {
      totalUsers,
      admins,
      faculty,
      students,
      active,
      inactive,
      departmentCount,
      programCount,
    };
  }

  async deleteUser(userId: string) {
    const [deletedUser] = await db
      .delete(users)
      .where(eq(users.id, userId))
      .returning();
      
    return deletedUser;
  }
}
