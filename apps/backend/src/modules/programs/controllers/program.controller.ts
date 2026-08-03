import type { Context } from "hono";

import { BadRequestException } from "../../../shared/exceptions/bad-request.exception.js";

import {
    createProgramSchema,
} from "../dto/create-program.dto.js";

import {
    findProgramsQuerySchema,
} from "../dto/find-programs-query.dto.js";

import {
    updateProgramSchema,
} from "../dto/update-program.dto.js";

import {
    updateProgramStatusSchema,
} from "../dto/update-program-status.dto.js";

import { ProgramService } from "../services/program.service.js";

export class ProgramController {
  private readonly service = new ProgramService();

  async create(c: Context) {
    const body = await c.req.json();

    const data = createProgramSchema.parse(body);

    const program = await this.service.create(data);

    return c.json(
      {
        success: true,
        data: program,
      },
      201,
    );
  }

  async findAll(c: Context) {
    const query = findProgramsQuerySchema.parse(c.req.query());

    const programs = await this.service.findAll(query);

    return c.json({
      success: true,
      data: programs,
    });
  }

  async findById(c: Context) {
    const id = c.req.param("id");

    if (!id) {
      throw new BadRequestException("Program id is required.");
    }

    const program = await this.service.findById(id);

    return c.json({
      success: true,
      data: program,
    });
  }

  async update(c: Context) {
    const id = c.req.param("id");

    if (!id) {
      throw new BadRequestException("Program id is required.");
    }

    const body = await c.req.json();

    const data = updateProgramSchema.parse(body);

    const program = await this.service.update(id, data);

    return c.json({
      success: true,
      data: program,
    });
  }

  async updateStatus(c: Context) {
    const id = c.req.param("id");

    if (!id) {
      throw new BadRequestException("Program id is required.");
    }

    const body = await c.req.json();

    const data = updateProgramStatusSchema.parse(body);

    const program = await this.service.updateStatus(id, data.isActive);

    return c.json({
      success: true,
      data: program,
    });
  }
}
