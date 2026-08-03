import type { Context } from "hono";

import { BadRequestException } from "../../../shared/exceptions/bad-request.exception.js";

import {
    createAcademicYearSchema,
} from "../dto/create-academic-year.dto.js";

import {
    findAcademicYearsQuerySchema,
} from "../dto/find-academic-years-query.dto.js";

import {
    updateAcademicYearSchema,
} from "../dto/update-academic-year.dto.js";

import {
    updateAcademicYearStatusSchema,
} from "../dto/update-academic-year-status.dto.js";

import { AcademicYearService } from "../services/academic-year.service.js";

export class AcademicYearController {
  private readonly service = new AcademicYearService();

  async create(c: Context) {
    const body = await c.req.json();

    const data = createAcademicYearSchema.parse(body);

    const academicYear = await this.service.create(data);

    return c.json({ success: true, data: academicYear }, 201);
  }

  async findAll(c: Context) {
    const query = findAcademicYearsQuerySchema.parse(c.req.query());

    const academicYears = await this.service.findAll(query);

    return c.json({ success: true, data: academicYears });
  }

  async findById(c: Context) {
    const id = c.req.param("id");

    if (!id) {
      throw new BadRequestException("Academic year id is required.");
    }

    const academicYear = await this.service.findById(id);

    return c.json({ success: true, data: academicYear });
  }

  async update(c: Context) {
    const id = c.req.param("id");

    if (!id) {
      throw new BadRequestException("Academic year id is required.");
    }

    const body = await c.req.json();

    const data = updateAcademicYearSchema.parse(body);

    const academicYear = await this.service.update(id, data);

    return c.json({ success: true, data: academicYear });
  }

  async updateStatus(c: Context) {
    const id = c.req.param("id");

    if (!id) {
      throw new BadRequestException("Academic year id is required.");
    }

    const body = await c.req.json();

    const data = updateAcademicYearStatusSchema.parse(body);

    const academicYear = await this.service.updateStatus(id, data.isActive);

    return c.json({ success: true, data: academicYear });
  }
}
