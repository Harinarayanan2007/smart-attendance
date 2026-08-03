import type { MiddlewareHandler } from "hono";

import { verifyAccessToken } from "../modules/identity/auth/utils/jwt.js";
import { UnauthorizedException } from "../shared/exceptions/unauthorized.exception.js";

export const authMiddleware: MiddlewareHandler = async (c, next) => {
  const authorization = c.req.header("Authorization");

  if (!authorization) {
    throw new UnauthorizedException(
      "Authorization header is missing."
    );
  }

  if (!authorization.startsWith("Bearer ")) {
    throw new UnauthorizedException(
      "Invalid authorization header."
    );
  }
    const token = authorization.substring(7);
    let payload;

    try {
    payload = verifyAccessToken(token);
    } catch {
    throw new UnauthorizedException(
        "Invalid or expired access token."
    );
    }

    c.set("user", payload);

    await next();
};
