import type { AuthTokenPayload } from "../modules/identity/auth/utils/jwt.js";

declare module "hono" {
  interface ContextVariableMap {
    user: AuthTokenPayload;
  }
}
