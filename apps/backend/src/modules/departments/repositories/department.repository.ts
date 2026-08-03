import {
  and,
  asc,
  desc,
  eq,
  ilike,
} from "drizzle-orm";

import { db } from "../../../database/client.js";
import { departments } from "../../../database/schema/index.js";
import { mapDatabaseError } from "../../../shared/exceptions/repository.exception.js";

import type { CreateDepartmentDto } from "../dto/create-department.dto.js";
import type { UpdateDepartmentDto } from "../dto/update-department.dto.js";

export class DepartmentRepository {
  constructor(private readonly dbClient = db) { }

  async existsByCode(code: string): Promise<boolean> {
    const department = await this.dbClient.query.departments.findFirst({
      where: eq(departments.code, code),
    });

    return !!department;
  }

  async existsByName(name: string): Promise<boolean> {
    const department = await this.dbClient.query.departments.findFirst({
      where: eq(departments.name, name),
    });

    return !!department;
  }

  async create(data: CreateDepartmentDto) {
    try {
      const [department] = await this.dbClient
        .insert(departments)
        .values(data)
        .returning();

      return department;
    } catch (error) {
      mapDatabaseError(error, "Failed to create department.");
    }
  }

  async count(where?: ReturnType<typeof and>) {
    const rows = await this.dbClient.query.departments.findMany({
      where,
    });

    return rows.length;
  }

  async findAll(options?: {
    page?: number | undefined;
    limit?: number | undefined;
    search?: string | undefined;
    sort?: string | undefined;
    order?: "asc" | "desc" | undefined;
    isActive?: boolean | undefined;
  }) {
    const {
      page = 1,
      limit = 10,
      search,
      sort = "name",
      order = "asc",
      isActive,
    } = options ?? {};

    const conditions = [];

    if (search) {
      conditions.push(
        ilike(departments.name, `%${search}%`)
      );
    }

    if (typeof isActive === "boolean") {
      conditions.push(
        eq(departments.isActive, isActive)
      );
    }

    const where =
      conditions.length > 0
        ? and(...conditions)
        : undefined;

    const sortColumn =
      sort === "code"
        ? departments.code
        : sort === "createdAt"
          ? departments.createdAt
          : departments.name;

    return this.dbClient.query.departments.findMany({
      where,

      orderBy:
        order === "desc"
          ? desc(sortColumn)
          : asc(sortColumn),

      limit,

      offset: (page - 1) * limit,
    });
  }

  async findById(id: string) {
    return this.dbClient.query.departments.findFirst({
      where: eq(departments.id, id),
    });
  }

  async update(id: string, data: UpdateDepartmentDto) {
    try {
      const [department] = await this.dbClient
        .update(departments)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(departments.id, id))
        .returning();

      return department;
    } catch (error) {
      mapDatabaseError(error, "Failed to update department.");
    }
  }

  async updateStatus(id: string, isActive: boolean) {
    try {
      const [department] = await this.dbClient
        .update(departments)
        .set({
          isActive,
          updatedAt: new Date(),
        })
        .where(eq(departments.id, id))
        .returning();

      return department;
    } catch (error) {
      mapDatabaseError(error, "Failed to update department status.");
    }
  }

  async findByCode(code: string) {
    return this.dbClient.query.departments.findFirst({
      where: eq(departments.code, code),
    });
  }

  async findActiveByCode(code: string) {
    return db.query.departments.findFirst({
      where: and(
        eq(departments.code, code),
        eq(departments.isActive, true),
      ),
    });
  }
}
