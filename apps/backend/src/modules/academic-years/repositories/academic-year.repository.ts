import { and, asc, desc, eq, ilike, or } from "drizzle-orm";

import { db } from "../../../database/client.js";
import { academicYears } from "../../../database/schema/index.js";
import { mapDatabaseError } from "../../../shared/exceptions/repository.exception.js";

import type { CreateAcademicYearDto } from "../dto/create-academic-year.dto.js";
import type { UpdateAcademicYearDto } from "../dto/update-academic-year.dto.js";

export class AcademicYearRepository {
  constructor(private readonly dbClient = db) { }

  async create(data: CreateAcademicYearDto) {
    try {
      const [academicYear] = await this.dbClient.insert(academicYears).values(data).returning();

      return academicYear;
    } catch (error) {
      mapDatabaseError(error, "Failed to create academic year.");
    }
  }

  async findAll(options?: {
    page?: number | undefined;
    limit?: number | undefined;
    search?: string | undefined;
    sort?: string | undefined;
    order?: "asc" | "desc" | undefined;
    isActive?: boolean | undefined;
    isCurrent?: boolean | undefined;
  }) {
    const {
      page = 1,
      limit = 10,
      search,
      sort = "name",
      order = "asc",
      isActive,
      isCurrent,
    } = options ?? {};

    const conditions = [];

    if (search) {
      conditions.push(or(ilike(academicYears.name, `%${search}%`)));
    }

    if (typeof isActive === "boolean") {
      conditions.push(eq(academicYears.isActive, isActive));
    }

    if (typeof isCurrent === "boolean") {
      conditions.push(eq(academicYears.isCurrent, isCurrent));
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const sortColumn =
      sort === "startDate"
        ? academicYears.startDate
        : sort === "endDate"
          ? academicYears.endDate
          : sort === "createdAt"
            ? academicYears.createdAt
            : academicYears.name;

    return this.dbClient.query.academicYears.findMany({
      where,
      orderBy: order === "desc" ? desc(sortColumn) : asc(sortColumn),
      limit,
      offset: (page - 1) * limit,
    });
  }

  async findById(id: string) {
    return this.dbClient.query.academicYears.findFirst({
      where: eq(academicYears.id, id),
    });
  }

  async update(id: string, data: UpdateAcademicYearDto) {
    try {
      const [academicYear] = await this.dbClient
        .update(academicYears)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(academicYears.id, id))
        .returning();

      return academicYear;
    } catch (error) {
      mapDatabaseError(error, "Failed to update academic year.");
    }
  }

  async updateStatus(id: string, isActive: boolean) {
    try {
      const [academicYear] = await this.dbClient
        .update(academicYears)
        .set({
          isActive,
          updatedAt: new Date(),
        })
        .where(eq(academicYears.id, id))
        .returning();

      return academicYear;
    } catch (error) {
      mapDatabaseError(error, "Failed to update academic year status.");
    }
  }

  async existsByName(name: string) {
    const academicYear = await this.dbClient.query.academicYears.findFirst({
      where: eq(academicYears.name, name),
    });

    return !!academicYear;
  }

  async clearCurrentAcademicYears() {
    try {
      await this.dbClient.update(academicYears).set({ isCurrent: false, updatedAt: new Date() }).where(eq(academicYears.isCurrent, true));
    } catch (error) {
      mapDatabaseError(error, "Failed to clear current academic years.");
    }
  }

  async findCurrentAcademicYear() {
    return this.dbClient.query.academicYears.findFirst({
      where: eq(academicYears.isCurrent, true),
    });
  }

  async updateCurrentState(id: string, data: { isCurrent?: boolean; isActive?: boolean }) {
    try {
      const [academicYear] = await this.dbClient
        .update(academicYears)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(academicYears.id, id))
        .returning();

      return academicYear;
    } catch (error) {
      mapDatabaseError(error, "Failed to update academic year state.");
    }
  }

  async runInTransaction<T>(callback: () => Promise<T>) {
    try {
      return await this.dbClient.transaction(async (tx) => callback());
    } catch (error) {
      mapDatabaseError(error, "Transaction failed.");
    }
  }
}
