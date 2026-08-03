import type { MiddlewareHandler } from "hono";

import { ForbiddenException } from "../shared/exceptions/forbidden.exception.js";

export function authorize(
  roles: string[],
): MiddlewareHandler {
  return async (c, next) => {
    const user = c.get("user");

    if (!roles.includes(user.role)) {
      throw new ForbiddenException(
        "You do not have permission to access this resource.",
      );
    }

    await next();
  };
}
