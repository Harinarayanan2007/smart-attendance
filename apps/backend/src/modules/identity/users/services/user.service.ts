import { ConflictException } from "../../../../shared/exceptions/conflict.exception.js";
import { NotFoundException } from "../../../../shared/exceptions/not-found.exception.js";
import { hashPassword } from "../../auth/utils/password.js";
import type { CreateUserRequestDto } from "../dto/create-user-request.dto.js";
import type { UserResponseDto } from "../dto/user-response.dto.js";
import { UserRepository } from "../repository/user.repository.js";
export class UserService {
  private readonly repository = new UserRepository();

  async create(
    data: CreateUserRequestDto,
  ): Promise<UserResponseDto> {

    // Check if email already exists
    const emailExists = await this.repository.existsByEmail(data.email);

    if (emailExists) {
      throw new ConflictException(
        "A user with this email already exists.",
      );
    }

    // Find role
    const role = await this.repository.findRoleByName(data.role);

    if (!role) {
      throw new NotFoundException(
        "Role not found.",
      );
    }

    // Hash password
    const passwordHash = await hashPassword(data.password);

    // Save user
    const user = await this.repository.create({
      email: data.email,
      passwordHash,
      roleId: role.id,
    });

    // Response
    return {
      id: user.id,
      email: user.email,
      role: role.name,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
  }
  async getAll(): Promise<UserResponseDto[]> {
      const users = await this.repository.findAll();

      return users.map((user) => ({
          id: user.id,
          email: user.email,
          role: user.role.name,
          isActive: user.isActive,
          createdAt: user.createdAt,
      }));
  }
  async getById(
      id: string,
  ): Promise<UserResponseDto> {
      const user = await this.repository.findById(id);

      if (!user) {
          throw new NotFoundException(
              "User not found.",
          );
      }

      return {
          id: user.id,
          email: user.email,
          role: user.role.name,
          isActive: user.isActive,
          createdAt: user.createdAt,
      };
  }
  async updateRole(
  userId: string,
  roleName: string,
): Promise<UserResponseDto> {
  // Check user exists
  const existingUser = await this.repository.findById(userId);

  if (!existingUser) {
    throw new NotFoundException(
      "User not found.",
    );
  }

  // Check role exists
  const role = await this.repository.findRoleByName(roleName);

  if (!role) {
    throw new NotFoundException(
      "Role not found.",
    );
  }

  // Prevent updating to same role
  if (existingUser.role.id === role.id) {
    throw new ConflictException(
      "User already has this role.",
    );
  }

  // Update
  await this.repository.updateRole(
    userId,
    role.id,
  );

  // Fetch updated user
  const updatedUser = await this.repository.findById(userId);

  if (!updatedUser) {
    throw new NotFoundException(
      "User not found.",
    );
  }

  return {
    id: updatedUser.id,
    email: updatedUser.email,
    role: updatedUser.role.name,
    isActive: updatedUser.isActive,
    createdAt: updatedUser.createdAt,
  };
}

async updateStatus(
  userId: string,
  isActive: boolean,
): Promise<UserResponseDto> {
  // Check user exists
  const existingUser = await this.repository.findById(userId);

  if (!existingUser) {
    throw new NotFoundException(
      "User not found.",
    );
  }

  // Prevent duplicate update
  if (existingUser.isActive === isActive) {
    throw new ConflictException(
      `User is already ${isActive ? "active" : "inactive"}.`,
    );
  }

  // Update status
  await this.repository.updateStatus(
    userId,
    isActive,
  );

  // Fetch updated user
  const updatedUser = await this.repository.findById(userId);

  if (!updatedUser) {
    throw new NotFoundException(
      "User not found.",
    );
  }

  return {
    id: updatedUser.id,
    email: updatedUser.email,
    role: updatedUser.role.name,
    isActive: updatedUser.isActive,
    createdAt: updatedUser.createdAt,
  };
}
}
