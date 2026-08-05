import { ForbiddenException } from "../../../../shared/exceptions/forbidden.exception.js";
import { UnauthorizedException } from "../../../../shared/exceptions/unauthorized.exception.js";
import type { LoginRequestDto } from "../dto/login-request.dto.js";
import type { LoginResponseDto } from "../dto/login-response.dto.js";
import type { RefreshRequestDto } from "../dto/refresh-request.dto.js";
import type { RefreshResponseDto } from "../dto/refresh-response.dto.js";
import type { ChangePasswordRequestDto } from "../dto/change-password-request.dto.js";
import { AuthRepository } from "../repository/auth.repository.js";
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} from "../utils/jwt.js";
import { verifyPassword, hashPassword } from "../utils/password.js";

export class AuthService {
  private readonly repository = new AuthRepository();

  private async validateCredentials(data: LoginRequestDto) {
    const user = await this.repository.findUserByLoginId(data.loginId);

    if (!user) {
        throw new UnauthorizedException("Invalid login ID or password.");
    }
    if (!user.isActive) {
        throw new ForbiddenException("Your account has been disabled.");
    }
    const isPasswordValid = await verifyPassword(
        data.password,
        user.passwordHash,
    );

    if (!isPasswordValid) {
        throw new UnauthorizedException("Invalid login ID or password.");
    }
    return user;
  }

  async adminLogin(data: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await this.validateCredentials(data);

    if (user.role.name !== "ADMIN") {
      throw new ForbiddenException("You are not authorized to access the Admin Portal.");
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
        loginId: user.loginId,
        role: user.role.name,
      },
    };
  }

  async mobileLogin(data: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await this.validateCredentials(data);

    if (user.role.name !== "STUDENT" && user.role.name !== "FACULTY") {
      throw new ForbiddenException("You are not authorized to access the Mobile App.");
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
        loginId: user.loginId,
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

    async changePassword(userId: string, data: ChangePasswordRequestDto): Promise<void> {
        const passwordHash = await hashPassword(data.newPassword);
        await this.repository.updatePassword(userId, passwordHash);
    }
}
