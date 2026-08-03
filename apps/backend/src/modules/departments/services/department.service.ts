import { BadRequestException } from "../../../shared/exceptions/bad-request.exception.js";
import { ConflictException } from "../../../shared/exceptions/conflict.exception.js";
import { NotFoundException } from "../../../shared/exceptions/not-found.exception.js";

import type { CreateDepartmentDto } from "../dto/create-department.dto.js";
import type { FindDepartmentsQueryDto } from "../dto/find-departments-query.dto.js";
import type { UpdateDepartmentDto } from "../dto/update-department.dto.js";

import { DepartmentRepository } from "../repositories/department.repository.js";

export class DepartmentService {
  private readonly repository = new DepartmentRepository();

  async create(data: CreateDepartmentDto) {
    const codeExists = await this.repository.existsByCode(data.code);

    if (codeExists) {
      throw new ConflictException("Department code already exists.");
    }

    const nameExists = await this.repository.existsByName(data.name);

    if (nameExists) {
      throw new ConflictException("Department name already exists.");
    }

    return this.repository.create(data);
  }

  async findAll(query?: FindDepartmentsQueryDto) {
    return this.repository.findAll(query);
  }

  async findById(id: string) {
    this.validateDepartmentId(id);

    const department = await this.repository.findById(id);

    if (!department) {
      throw new NotFoundException("Department not found.");
    }

    return department;
  }

  private validateDepartmentId(id: string) {
    if (!this.isValidUuid(id)) {
      throw new BadRequestException("Department id must be a valid UUID.");
    }
  }

  private isValidUuid(value: string) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
  }

  async update(id: string, data: UpdateDepartmentDto) {
    this.validateDepartmentId(id);

    await this.findById(id);

    if (data.code) {
      const existing = await this.repository.findByCode(data.code);

      if (existing && existing.id !== id) {
        throw new ConflictException("Department code already exists.");
      }
    }

    if (data.name) {
      const departments = await this.repository.findAll();

      const duplicate = departments.find(
        (department) =>
          department.name.toLowerCase() === data.name!.toLowerCase() &&
          department.id !== id,
      );

      if (duplicate) {
        throw new ConflictException("Department name already exists.");
      }
    }

    return this.repository.update(id, data);
  }

  async updateStatus(id: string, isActive: boolean) {
    this.validateDepartmentId(id);

    await this.findById(id);

    return this.repository.updateStatus(id, isActive);
  }
}
