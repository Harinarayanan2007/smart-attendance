import { BadRequestException } from "../../../shared/exceptions/bad-request.exception.js";
import { ConflictException } from "../../../shared/exceptions/conflict.exception.js";
import { NotFoundException } from "../../../shared/exceptions/not-found.exception.js";

import type { CreateBatchDto } from "../dto/create-batch.dto.js";
import type { FindBatchesQueryDto } from "../dto/find-batches-query.dto.js";
import type { UpdateBatchDto } from "../dto/update-batch.dto.js";

import { BatchRepository } from "../repositories/batch.repository.js";

export class BatchService {
  private readonly repository = new BatchRepository();

  async create(data: CreateBatchDto) {
    if (await this.repository.existsByStartYear(data.startYear)) {
      throw new ConflictException("Batch for this start year already exists.");
    }

    const endYear = data.startYear + 4;
    const name = `${data.startYear}-${endYear}`;

    const normalizedData = {
      ...data,
      name,
      endYear,
      isActive: data.isActive ?? true,
    };

    return this.repository.create(normalizedData);
  }

  async findAll(query?: FindBatchesQueryDto) {
    return this.repository.findAll(query);
  }

  async findById(id: string) {
    this.validateBatchId(id);

    const batch = await this.repository.findById(id);

    if (!batch) {
      throw new NotFoundException("Batch not found.");
    }

    return batch;
  }

  private validateBatchId(id: string) {
    if (!this.isValidUuid(id)) {
      throw new BadRequestException("Batch id must be a valid UUID.");
    }
  }

  private isValidUuid(value: string) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
  }

  async update(id: string, data: UpdateBatchDto) {
    this.validateBatchId(id);
    const existing = await this.findById(id);

    if (data.startYear) {
       // Changing startYear implies full recalculation. We can block it for now.
       if (data.startYear !== existing.startYear) {
           throw new BadRequestException("Changing start year is currently unsupported.");
       }
    }

    const normalizedData = {
      ...data,
      isActive: data.isActive ?? existing.isActive,
    };

    return this.repository.update(id, normalizedData);
  }

  async updateStatus(id: string, isActive: boolean) {
    this.validateBatchId(id);
    await this.findById(id); // Ensure exists
    return this.repository.updateStatus(id, isActive);
  }

  async delete(id: string) {
    this.validateBatchId(id);
    await this.findById(id);
    return this.repository.delete(id);
  }

  async getOptions() {
    return this.repository.getOptions();
  }
}
