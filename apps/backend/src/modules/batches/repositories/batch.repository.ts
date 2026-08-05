import { and, asc, desc, eq, ilike, or } from "drizzle-orm";

import { db } from "../../../database/client.js";
import { batches } from "../../../database/schema/index.js";
import { mapDatabaseError } from "../../../shared/exceptions/repository.exception.js";

import type { CreateBatchDto } from "../dto/create-batch.dto.js";
import type { UpdateBatchDto } from "../dto/update-batch.dto.js";

export class BatchRepository {
  constructor(private readonly dbClient = db) { }

  async create(data: CreateBatchDto & { name: string; endYear: number }) {
    try {
      const [batch] = await this.dbClient.insert(batches).values(data).returning();

      return batch;
    } catch (error) {
      mapDatabaseError(error, "Failed to create batch.");
    }
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
      conditions.push(ilike(batches.name, `%${search}%`));
    }

    if (typeof isActive === "boolean") {
      conditions.push(eq(batches.isActive, isActive));
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const sortColumn =
      sort === "startYear"
        ? batches.startYear
        : sort === "endYear"
          ? batches.endYear
          : sort === "createdAt"
              ? batches.createdAt
              : batches.name;

    return this.dbClient.query.batches.findMany({
      where,
      orderBy: order === "desc" ? desc(sortColumn) : asc(sortColumn),
      limit,
      offset: (page - 1) * limit,
    });
  }

  async findById(id: string) {
    return this.dbClient.query.batches.findFirst({
      where: eq(batches.id, id),
    });
  }

  async update(id: string, data: UpdateBatchDto) {
    try {
      const [batch] = await this.dbClient
        .update(batches)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(batches.id, id))
        .returning();

      return batch;
    } catch (error) {
      mapDatabaseError(error, "Failed to update batch.");
    }
  }

  async updateStatus(id: string, isActive: boolean) {
    try {
      const [batch] = await this.dbClient
        .update(batches)
        .set({
          isActive,
          updatedAt: new Date(),
        })
        .where(eq(batches.id, id))
        .returning();

      return batch;
    } catch (error) {
      mapDatabaseError(error, "Failed to update batch status.");
    }
  }

  async existsByStartYear(startYear: number) {
    const batch = await this.dbClient.query.batches.findFirst({
      where: eq(batches.startYear, startYear),
    });

    return !!batch;
  }

  async delete(id: string) {
    try {
      const [batch] = await this.dbClient
        .delete(batches)
        .where(eq(batches.id, id))
        .returning();

      return batch;
    } catch (error) {
      mapDatabaseError(error, "Failed to delete batch.");
    }
  }

  async getOptions() {
    const conditions = [eq(batches.isActive, true)];
    
    return this.dbClient.query.batches.findMany({
      columns: {
        id: true,
        name: true,
      },
      where: and(...conditions),
      orderBy: [asc(batches.startYear)],
    });
  }

  async runInTransaction<T>(callback: () => Promise<T>) {
    try {
      return await this.dbClient.transaction(async (tx) => callback());
    } catch (error) {
      mapDatabaseError(error, "Transaction failed.");
    }
  }
}
