import { BadRequestException } from "../../../shared/exceptions/bad-request.exception.js";
import { ConflictException } from "../../../shared/exceptions/conflict.exception.js";
import { NotFoundException } from "../../../shared/exceptions/not-found.exception.js";

import type { CreateAcademicYearDto } from "../dto/create-academic-year.dto.js";
import type { FindAcademicYearsQueryDto } from "../dto/find-academic-years-query.dto.js";
import type { UpdateAcademicYearDto } from "../dto/update-academic-year.dto.js";

import { AcademicYearRepository } from "../repositories/academic-year.repository.js";

export class AcademicYearService {
  private readonly repository = new AcademicYearRepository();

  async create(data: CreateAcademicYearDto) {
    this.validateAcademicYearDates(data.startDate, data.endDate);

    const normalizedData = {
      ...data,
      isCurrent: data.isCurrent === true,
      isActive: data.isActive ?? true,
    };

    if (normalizedData.isCurrent && normalizedData.isActive === false) {
      throw new BadRequestException("Inactive academic year cannot be current.");
    }

    if (await this.repository.existsByName(data.name)) {
      throw new ConflictException("Academic year name already exists.");
    }

    if (normalizedData.isCurrent) {
      const currentAcademicYear = await this.repository.findCurrentAcademicYear();

      if (currentAcademicYear) {
        throw new BadRequestException("Only one academic year can be current at a time.");
      }

      return this.repository.runInTransaction(async () => {
        await this.repository.clearCurrentAcademicYears();
        return this.repository.create(normalizedData);
      });
    }

    return this.repository.create(normalizedData);
  }

  async findAll(query?: FindAcademicYearsQueryDto) {
    return this.repository.findAll(query);
  }

  async findById(id: string) {
    this.validateAcademicYearId(id);

    const academicYear = await this.repository.findById(id);

    if (!academicYear) {
      throw new NotFoundException("Academic year not found.");
    }

    return academicYear;
  }

  private validateAcademicYearId(id: string) {
    if (!this.isValidUuid(id)) {
      throw new BadRequestException("Academic year id must be a valid UUID.");
    }
  }

  private validateAcademicYearDates(startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      throw new BadRequestException("Dates must be valid ISO date strings.");
    }

    if (end <= start) {
      throw new BadRequestException("Start date must be before end date.");
    }
  }

  private isValidUuid(value: string) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
  }

  async update(id: string, data: UpdateAcademicYearDto) {
    this.validateAcademicYearId(id);

    const existing = await this.findById(id);

    if (data.name && data.name !== existing.name && (await this.repository.existsByName(data.name))) {
      throw new ConflictException("Academic year name already exists.");
    }

    if (data.startDate || data.endDate) {
      this.validateAcademicYearDates(
        data.startDate ?? existing.startDate,
        data.endDate ?? existing.endDate,
      );
    }

    const normalizedData = {
      ...data,
      isCurrent: data.isCurrent ?? existing.isCurrent,
      isActive: data.isActive ?? existing.isActive,
    };

    if (normalizedData.isCurrent && normalizedData.isActive === false) {
      throw new BadRequestException("Inactive academic year cannot be current.");
    }

    if (normalizedData.isCurrent && !existing.isActive && data.isCurrent) {
      throw new BadRequestException("Inactive academic years cannot be set as current.");
    }

    if (normalizedData.isCurrent) {
      const currentAcademicYear = await this.repository.findCurrentAcademicYear();

      if (currentAcademicYear && currentAcademicYear.id !== id) {
        throw new BadRequestException("Only one academic year can be current at a time.");
      }
      return this.repository.runInTransaction(async () => {
        await this.repository.clearCurrentAcademicYears();
        return this.repository.updateCurrentState(id, {
          isCurrent: true,
          isActive: normalizedData.isActive,
        });
      });
    }

    if (normalizedData.isActive === false) {
      return this.repository.runInTransaction(async () => {
        return this.repository.updateCurrentState(id, {
          isCurrent: false,
          isActive: false,
        });
      });
    }

    return this.repository.updateCurrentState(id, {
      isCurrent: normalizedData.isCurrent,
      isActive: normalizedData.isActive,
    });
  }

  async updateStatus(id: string, isActive: boolean) {
    this.validateAcademicYearId(id);

    const existing = await this.findById(id);

    if (!isActive && existing.isCurrent) {
      return this.repository.runInTransaction(async () => {
        return this.repository.updateCurrentState(id, {
          isCurrent: false,
          isActive: false,
        });
      });
    }

    return this.repository.updateStatus(id, isActive);
  }
}
