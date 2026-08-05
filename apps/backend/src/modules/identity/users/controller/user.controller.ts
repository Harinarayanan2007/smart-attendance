import type { Context } from "hono";
import { CreateUserRequestSchema } from "../dto/create-user-request.dto.js";
import { UpdateUserRequestSchema } from "../dto/update-user-request.dto.js";
import { UpdateUserStatusRequestSchema } from "../dto/update-user-status-request.dto.js";
import { UpdateUserPasswordRequestSchema } from "../dto/update-user-password-request.dto.js";
import { UpdateAdmissionIdRequestSchema } from "../dto/update-admission-id-request.dto.js";
import { ResetPasswordRequestSchema } from "../dto/reset-password-request.dto.js";
import { UserService } from "../services/user.service.js";
import { hashPassword } from "../../auth/utils/password.js";

export class UserController {
  private readonly service = new UserService();

  async create(c: Context) {
    const body = await c.req.json();
    const data = CreateUserRequestSchema.parse(body);
    const user = c.get("user");

    const createdUser = await this.service.create(data, user?.id);

    return c.json(
      {
        success: true,
        data: createdUser,
        message: "User created successfully",
      },
      201,
    );
  }

  async getAll(c: Context) {
    const page = parseInt(c.req.query("page") || "1", 10);
    const limit = parseInt(c.req.query("limit") || "10", 10);
    const search = c.req.query("search");
    const sort = c.req.query("sort");
    const order = c.req.query("order") as "asc" | "desc" | undefined;
    const role = c.req.query("role");
    
    let isActive: boolean | undefined = undefined;
    if (c.req.query("status") === "active") isActive = true;
    if (c.req.query("status") === "inactive") isActive = false;

    const departmentId = c.req.query("departmentId");
    const programId = c.req.query("programId");
    const batchId = c.req.query("batchId");

    const options: any = { page, limit };
    if (search) options.search = search;
    if (sort) options.sort = sort;
    if (order) options.order = order;
    if (role) options.role = role;
    if (isActive !== undefined) options.isActive = isActive;
    if (departmentId) options.departmentId = departmentId;
    if (programId) options.programId = programId;
    if (batchId) options.batchId = batchId;

    const result = await this.service.getAll(options);

    return c.json({
      success: true,
      data: result.data,
      meta: {
        total: result.total,
        page,
        limit,
      }
    });
  }

  async getById(c: Context) {
    const id = c.req.param("id") as string;
    const user = await this.service.getById(id);

    return c.json({
      success: true,
      data: user,
    });
  }

  async update(c: Context) {
    const id = c.req.param("id") as string;
    const body = await c.req.json();
    const data = UpdateUserRequestSchema.parse(body);
    const user = c.get("user");

    const updatedUser = await this.service.update(id, data, user?.id);

    return c.json({
      success: true,
      data: updatedUser,
      message: "User updated successfully",
    });
  }

  async updateStatus(c: Context) {
    const id = c.req.param("id") as string;
    const body = await c.req.json();
    const { isActive } = UpdateUserStatusRequestSchema.parse(body);

    const updatedUser = await this.service.updateStatus(id, isActive);

    return c.json({
      success: true,
      data: updatedUser,
      message: `User ${isActive ? "activated" : "deactivated"} successfully`,
    });
  }

  async updatePassword(c: Context) {
    const id = c.req.param("id") as string;
    const body = await c.req.json();
    const { password } = UpdateUserPasswordRequestSchema.parse(body);
    
    const passwordHash = await hashPassword(password);
    
    const updatedUser = await this.service.updatePassword(id, passwordHash);

    return c.json({
      success: true,
      data: updatedUser,
      message: "Password updated successfully",
    });
  }

  async updateAdmissionId(c: Context) {
    const id = c.req.param("id") as string;
    const body = await c.req.json();
    const data = UpdateAdmissionIdRequestSchema.parse(body);
    const user = c.get("user");

    const updatedUser = await this.service.updateAdmissionId(id, data, user?.id);

    return c.json({
      success: true,
      data: updatedUser,
      message: "Admission ID updated successfully",
    });
  }

  async resetPassword(c: Context) {
    const id = c.req.param("id") as string;
    const body = await c.req.json();
    const { password } = ResetPasswordRequestSchema.parse(body);

    const updatedUser = await this.service.resetPassword(id, password);

    return c.json({
      success: true,
      data: updatedUser,
      message: "Password reset successfully",
    });
  }

  async getStatistics(c: Context) {
    const stats = await this.service.getStatistics();
    return c.json({
      success: true,
      data: { statistics: stats },
    });
  }

  async getOptions(c: Context) {
    const options = await this.service.getOptions();
    return c.json({
      success: true,
      data: options,
    });
  }

  async deleteUser(c: Context) {
    const id = c.req.param("id") as string;
    const user = c.get("user");

    const deletedUser = await this.service.deleteUser(id, user?.id);

    return c.json({
      success: true,
      data: deletedUser,
      message: "User deleted successfully",
    });
  }
}
