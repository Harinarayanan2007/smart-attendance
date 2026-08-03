import { ConflictException } from "../../../shared/exceptions/conflict.exception.js";
import { NotFoundException } from "../../../shared/exceptions/not-found.exception.js";

import type { CreateProgramDto } from "../dto/create-program.dto.js";
import type { FindProgramsQueryDto } from "../dto/find-programs-query.dto.js";
import type { UpdateProgramDto } from "../dto/update-program.dto.js";

import { DepartmentRepository } from "../../departments/repositories/department.repository.js";
import { ProgramRepository } from "../repositories/program.repository.js";

export class ProgramService {
  private readonly repository = new ProgramRepository();
  private readonly departmentRepository = new DepartmentRepository();

  async create(data: CreateProgramDto) {
    const department = await this.departmentRepository.findById(data.departmentId);

    if (!department) {
      throw new NotFoundException("Department not found.");
    }

    const codeExists = await this.repository.existsByCode(data.code);

    if (codeExists) {
      throw new ConflictException("Program code already exists.");
    }

    const nameExists = await this.repository.existsByDepartmentAndName(
      data.departmentId,
      data.name,
    );

    if (nameExists) {
      throw new ConflictException("Program name already exists in this department.");
    }

    return this.repository.create(data);
  }

  async findAll(query?: FindProgramsQueryDto) {
    return this.repository.findAll(query);
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

    if (data.departmentId) {
      const department = await this.departmentRepository.findById(data.departmentId);

      if (!department) {
        throw new NotFoundException("Department not found.");
      }
    }

    if (data.code) {
      const existing = await this.repository.findByCode(data.code);

      if (existing && existing.id !== id) {
        throw new ConflictException("Program code already exists.");
      }
    }

    if (data.name) {
      const currentProgram = await this.repository.findById(id);
      const departmentId = data.departmentId ?? currentProgram?.departmentId;

      if (!departmentId) {
        throw new NotFoundException("Department not found.");
      }

      const duplicate = await this.repository.findByDepartmentAndName(departmentId, data.name);

      if (duplicate && duplicate.id !== id) {
        throw new ConflictException("Program name already exists in this department.");
      }
    }

    return this.repository.update(id, data);
  }

  async updateStatus(id: string, isActive: boolean) {
    await this.findById(id);

    return this.repository.updateStatus(id, isActive);
  }
}
