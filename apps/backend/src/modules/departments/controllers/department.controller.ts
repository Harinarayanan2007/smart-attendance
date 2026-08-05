import type { Context } from "hono";

import { BadRequestException } from "../../../shared/exceptions/bad-request.exception.js";

import {
    createDepartmentSchema,
} from "../dto/create-department.dto.js";

import {
    findDepartmentsQuerySchema,
} from "../dto/find-departments-query.dto.js";

import {
    updateDepartmentSchema,
} from "../dto/update-department.dto.js";

import {
    updateDepartmentStatusSchema,
} from "../dto/update-department-status.dto.js";

import { DepartmentService } from "../services/department.service.js";

export class DepartmentController {
  private readonly service = new DepartmentService();

  async create(c: Context) {
    const body = await c.req.json();

    const data = createDepartmentSchema.parse(body);

    const department = await this.service.create(data);

    return c.json(
      {
        success: true,
        data: department,
      },
      201,
    );
  }

  async findAll(c: Context) {
    const query = findDepartmentsQuerySchema.parse(c.req.query());

    const departments = await this.service.findAll(query);

    return c.json({
      success: true,
      data: departments,
    });
  }

  async findById(c: Context) {
    const id = c.req.param("id");

    if (!id) {
      throw new BadRequestException("Department id is required.");
    }

    const department = await this.service.findById(id);

    return c.json({
      success: true,
      data: department,
    });
  }

  async update(c: Context) {
    const id = c.req.param("id");

    if (!id) {
      throw new BadRequestException("Department id is required.");
    }

    const body = await c.req.json();

    const data = updateDepartmentSchema.parse(body);

    const department = await this.service.update(id, data);

    return c.json({
      success: true,
      data: department,
    });
  }

  async updateStatus(c: Context) {
    const id = c.req.param("id");

    if (!id) {
      throw new BadRequestException("Department id is required.");
    }

    const body = await c.req.json();

    const data = updateDepartmentStatusSchema.parse(body);

    const department = await this.service.updateStatus(
      id,
      data.isActive,
    );

    return c.json({
      success: true,
      data: department,
    });
  }

  async delete(c: Context) {
    const id = c.req.param("id");

    if (!id) {
      throw new BadRequestException("Department id is required.");
    }

    const department = await this.service.delete(id);

    return c.json({
      success: true,
      data: department,
    });
  }

  async getOptions(c: Context) {
    const options = await this.service.getOptions();

    return c.json({
      success: true,
      data: options,
    });
  }
}
