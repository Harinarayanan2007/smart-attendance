import { ForbiddenException } from "../../../../shared/exceptions/forbidden.exception.js";
import { UnauthorizedException } from "../../../../shared/exceptions/unauthorized.exception.js";
import type { LoginRequestDto } from "../dto/login-request.dto.js";
import type { LoginResponseDto } from "../dto/login-response.dto.js";
import type { RefreshRequestDto } from "../dto/refresh-request.dto.js";
import type { RefreshResponseDto } from "../dto/refresh-response.dto.js";
import { AuthRepository } from "../repository/auth.repository.js";
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} from "../utils/jwt.js";
import { verifyPassword } from "../utils/password.js";

export class AuthService {
  private readonly repository = new AuthRepository();

  async login(
    data: LoginRequestDto,
    ): Promise<LoginResponseDto> {
    const user = await this.repository.findUserByEmail(data.email);

    if (!user) {
        throw new UnauthorizedException(
        "Invalid email or password."
        );
    }
    if (!user.isActive) {
        throw new ForbiddenException(
            "Your account has been disabled."
        );
    }
    const isPasswordValid = await verifyPassword(
        data.password,
        user.passwordHash,
    );

    if (!isPasswordValid) {
        throw new UnauthorizedException("Invalid email or password.");
    }
    const payload = {
        userId: user.id,
        role: user.role.name,
        };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);
        await this.repository.updateLastLogin(user.id);

    return {
        accessToken,
        refreshToken,
        user: {
            id: user.id,
            email: user.email,
            role: user.role.name,
        },
    };
    }

    async refresh(
        data: RefreshRequestDto,
        ): Promise<RefreshResponseDto> {
        let payload;

        try {
            payload = verifyRefreshToken(data.refreshToken);
        } catch {
            throw new UnauthorizedException(
            "Invalid or expired refresh token.",
            );
        }

        const accessToken = generateAccessToken({
            userId: payload.userId,
            role: payload.role,
        });

        const refreshToken = generateRefreshToken({
            userId: payload.userId,
            role: payload.role,
        });

        return {
            accessToken,
            refreshToken,
        };
    }
}
