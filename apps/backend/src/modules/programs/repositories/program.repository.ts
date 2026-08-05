import {
    and,
    asc,
    desc,
    eq,
    ilike,
    or,
} from "drizzle-orm";

import { db } from "../../../database/client.js";
import { programs } from "../../../database/schema/index.js";

import type { CreateProgramDto } from "../dto/create-program.dto.js";
import type { UpdateProgramDto } from "../dto/update-program.dto.js";

export class ProgramRepository {
  async existsByCode(code: string): Promise<boolean> {
    const program = await db.query.programs.findFirst({
      where: eq(programs.code, code),
    });

    return !!program;
  }

  async existsByName(name: string): Promise<boolean> {
    const program = await db.query.programs.findFirst({
      where: eq(programs.name, name),
    });

    return !!program;
  }



  async create(data: CreateProgramDto) {
    const [program] = await db.insert(programs).values(data).returning();

    return program;
  }

  async findAll(options?: {
    page?: number | undefined;
    limit?: number | undefined;
    search?: string | undefined;
    sort?: string | undefined;
    order?: "asc" | "desc" | undefined;
    isActive?: boolean | undefined;
    departmentId?: string | undefined;
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
        or(
          ilike(programs.name, `%${search}%`),
          ilike(programs.code, `%${search}%`),
        ),
      );
    }

    if (typeof isActive === "boolean") {
      conditions.push(eq(programs.isActive, isActive));
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const sortColumn =
      sort === "code"
        ? programs.code
        : sort === "createdAt"
          ? programs.createdAt
          : programs.name;

    return db.query.programs.findMany({
      where,
      orderBy: order === "desc" ? desc(sortColumn) : asc(sortColumn),
      limit,
      offset: (page - 1) * limit,
    });
  }

  async findById(id: string) {
    return db.query.programs.findFirst({
      where: eq(programs.id, id),
    });
  }

  async findByCode(code: string) {
    return db.query.programs.findFirst({
      where: eq(programs.code, code),
    });
  }



  async update(id: string, data: UpdateProgramDto) {
    const [program] = await db
      .update(programs)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(programs.id, id))
      .returning();

    return program;
  }

  async updateStatus(id: string, isActive: boolean) {
    const [program] = await db
      .update(programs)
      .set({
        isActive,
        updatedAt: new Date(),
      })
      .where(eq(programs.id, id))
      .returning();

    return program;
  }

  async count(where?: ReturnType<typeof and>) {
    const rows = await db.query.programs.findMany({ where });

    return rows.length;
  }

  async delete(id: string) {
    const [program] = await db
      .delete(programs)
      .where(eq(programs.id, id))
      .returning();

    return program;
  }

  async getOptions() {
    return db.query.programs.findMany({
      columns: {
        id: true,
        name: true,
      },
      where: eq(programs.isActive, true),
      orderBy: [asc(programs.name)],
    });
  }

  async getStatistics() {
    // Note: In Drizzle, we can do raw counts or use sql.
    // For simplicity, we can just fetch all programs and calculate in memory if it's small,
    // but a proper query is better.
    const allPrograms = await db.query.programs.findMany({
      columns: {
        isActive: true,
      }
    });

    const totalPrograms = allPrograms.length;
    const activePrograms = allPrograms.filter(p => p.isActive).length;
    const inactivePrograms = totalPrograms - activePrograms;

    return {
      totalPrograms,
      activePrograms,
      inactivePrograms,
    };
  }
}
