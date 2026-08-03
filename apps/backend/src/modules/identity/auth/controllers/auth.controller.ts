import type { Context } from "hono";

import { LoginRequestSchema } from "../dto/login-request.dto.js";
import { RefreshRequestSchema } from "../dto/refresh-request.dto.js";
import { AuthService } from "../services/auth.service.js";

export class AuthController {
  private readonly authService = new AuthService();

  async login(c: Context) {
    const body = await c.req.json();

    const data = LoginRequestSchema.parse(body);

    const result = await this.authService.login(data);

    return c.json(result, 200);
  }

  async me(c: Context) {
    const user = c.get("user");

    return c.json({
      success: true,
      data: user,
      timestamp: new Date().toISOString(),
    });
  }

  async refresh(c: Context) {
    const body = await c.req.json();
    const data = RefreshRequestSchema.parse(body);

    const result = await this.authService.refresh(data);

    return c.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  }

  async admin(c: Context) {
    const user = c.get("user");

    return c.json({
      success: true,
      data: {
        message: "Welcome Admin!",
        user: {
          userId: user.userId,
          role: user.role,
        },
      },
      timestamp: new Date().toISOString(),
    });
  }
}
