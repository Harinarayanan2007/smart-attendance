import jwt, { type JwtPayload, type Secret, type SignOptions } from "jsonwebtoken";
import { env } from "../../../../config/env.js";

export interface AuthTokenPayload extends JwtPayload {
  userId: string;
  role: string;
}

export function generateAccessToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET as Secret, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
  } as SignOptions);
}

export function generateRefreshToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET as Secret, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  } as SignOptions);
}

export function verifyAccessToken(token: string): AuthTokenPayload {
  return jwt.verify(
    token,
    env.JWT_ACCESS_SECRET as Secret
  ) as AuthTokenPayload;
}

export function verifyRefreshToken(token: string): AuthTokenPayload {
  return jwt.verify(
    token,
    env.JWT_REFRESH_SECRET as Secret
  ) as AuthTokenPayload;
}
