import { ConflictException } from "../../../shared/exceptions/conflict.exception.js";
import { NotFoundException } from "../../../shared/exceptions/not-found.exception.js";

import type { CreateProgramDto } from "../dto/create-program.dto.js";
import type { FindProgramsQueryDto } from "../dto/find-programs-query.dto.js";
import type { UpdateProgramDto } from "../dto/update-program.dto.js";

import { ProgramRepository } from "../repositories/program.repository.js";

export class ProgramService {
  private readonly repository = new ProgramRepository();

  async create(data: CreateProgramDto) {
    const codeExists = await this.repository.existsByCode(data.code);

    if (codeExists) {
      throw new ConflictException("Program code already exists.");
    }

    const nameExists = await this.repository.existsByName(data.name);

    if (nameExists) {
      throw new ConflictException("Program name already exists.");
    }

    return this.repository.create(data);
  }

  async findAll(query?: FindProgramsQueryDto) {
    const programs = await this.repository.findAll(query);
    
    return programs;
  }

  async findById(id: string) {
    const program = await this.repository.findById(id);

    if (!program) {
      throw new NotFoundException("Program not found.");
    }

    return program;
  }

  async update(id: string, data: UpdateProgramDto) {
    await this.findById(id);

    if (data.code) {
      const existing = await this.repository.findByCode(data.code);

      if (existing && existing.id !== id) {
        throw new ConflictException("Program code already exists.");
      }
    }

    if (data.name) {
      const duplicate = await this.repository.existsByName(data.name);

      if (duplicate && (await this.repository.findById(id))?.name !== data.name) {
        throw new ConflictException("Program name already exists.");
      }
    }

    return this.repository.update(id, data);
  }

  async updateStatus(id: string, isActive: boolean) {
    await this.findById(id);

    return this.repository.updateStatus(id, isActive);
  }

  async delete(id: string) {
    await this.findById(id);

    return this.repository.delete(id);
  }

  async getOptions() {
    return this.repository.getOptions();
  }

  async getStatistics() {
    return this.repository.getStatistics();
  }
}
