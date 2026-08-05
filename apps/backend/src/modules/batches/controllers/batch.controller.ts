import type { Context } from "hono";

import { BadRequestException } from "../../../shared/exceptions/bad-request.exception.js";

import {
    createBatchSchema,
} from "../dto/create-batch.dto.js";

import {
    findBatchesQuerySchema,
} from "../dto/find-batches-query.dto.js";

import {
    updateBatchSchema,
} from "../dto/update-batch.dto.js";

import {
    updateBatchStatusSchema,
} from "../dto/update-batch-status.dto.js";

import { BatchService } from "../services/batch.service.js";

export class BatchController {
  private readonly service = new BatchService();

  async create(c: Context) {
    const body = await c.req.json();
    const data = createBatchSchema.parse(body);
    const batch = await this.service.create(data);

    return c.json({ success: true, data: batch }, 201);
  }

  async findAll(c: Context) {
    const query = findBatchesQuerySchema.parse(c.req.query());
    const batches = await this.service.findAll(query);

    return c.json({ success: true, data: batches });
  }

  async findById(c: Context) {
    const id = c.req.param("id");

    if (!id) {
      throw new BadRequestException("Batch id is required.");
    }

    const batch = await this.service.findById(id);

    return c.json({ success: true, data: batch });
  }

  async update(c: Context) {
    const id = c.req.param("id");

    if (!id) {
      throw new BadRequestException("Batch id is required.");
    }

    const body = await c.req.json();
    const data = updateBatchSchema.parse(body);
    const batch = await this.service.update(id, data);

    return c.json({ success: true, data: batch });
  }

  async updateStatus(c: Context) {
    const id = c.req.param("id");

    if (!id) {
      throw new BadRequestException("Batch id is required.");
    }

    const body = await c.req.json();
    const data = updateBatchStatusSchema.parse(body);
    const batch = await this.service.updateStatus(id, data.isActive);

    return c.json({ success: true, data: batch });
  }

  async delete(c: Context) {
    const id = c.req.param("id");

    if (!id) {
      throw new BadRequestException("Batch id is required.");
    }

    const batch = await this.service.delete(id);

    return c.json({ success: true, data: batch });
  }

  async getOptions(c: Context) {
    const options = await this.service.getOptions();

    return c.json({
      success: true,
      data: options,
    });
  }
}
