import type { Context } from "hono";
import { BadRequestException } from "../../../../shared/exceptions/bad-request.exception.js";
import { CreateUserRequestSchema } from "../dto/create-user-request.dto.js";
import { UpdateUserRoleRequestSchema } from "../dto/update-user-role-request.dto.js";
import { UpdateUserStatusRequestSchema } from "../dto/update-user-status-request.dto.js";
import { UserService } from "../services/user.service.js";

export class UserController {
    private readonly userService = new UserService();

    async create(c: Context) {
        const body = await c.req.json();

        const data = CreateUserRequestSchema.parse(body);

        const result = await this.userService.create(data);

        return c.json(
            {
                success: true,
                data: result,
                timestamp: new Date().toISOString(),
            },
            201,
        );
    }
    async getAll(c: Context) {
  const users = await this.userService.getAll();

  return c.json(
    {
      success: true,
      data: users,
      timestamp: new Date().toISOString(),
    },
    200,
  );
}

async getById(c: Context) {
    const id = c.req.param("id");

    if (!id) {
        throw new BadRequestException("User ID is required.");
    }

    const user = await this.userService.getById(id);

    return c.json(
        {
            success: true,
            data: user,
            timestamp: new Date().toISOString(),
        },
        200,
    );
}

async updateRole(c: Context) {
  const id = c.req.param("id");

  if (!id) {
    throw new BadRequestException(
      "User ID is required.",
    );
  }

  const body = await c.req.json();

  const data =
    UpdateUserRoleRequestSchema.parse(body);

  const user =
    await this.userService.updateRole(
      id,
      data.role,
    );

  return c.json(
    {
      success: true,
      data: user,
      timestamp: new Date().toISOString(),
    },
    200,
  );
}

async updateStatus(c: Context) {
    const id = c.req.param("id");

    if (!id) {
        throw new BadRequestException(
            "User ID is required.",
        );
    }

    const body = await c.req.json();

    const data =
        UpdateUserStatusRequestSchema.parse(body);

    const user =
        await this.userService.updateStatus(
            id,
            data.isActive,
        );

    return c.json(
        {
            success: true,
            data: user,
            timestamp: new Date().toISOString(),
        },
        200,
    );
}
}
