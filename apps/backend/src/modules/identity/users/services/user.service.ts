import { ConflictException } from "../../../../shared/exceptions/conflict.exception.js";
import { NotFoundException } from "../../../../shared/exceptions/not-found.exception.js";
import { hashPassword } from "../../auth/utils/password.js";
import type { CreateUserRequestDto } from "../dto/create-user-request.dto.js";
import type { UpdateUserRequestDto } from "../dto/update-user-request.dto.js";
import type { UpdateAdmissionIdRequestDto } from "../dto/update-admission-id-request.dto.js";
import type { UserResponseDto } from "../dto/user-response.dto.js";
import { BadRequestException } from "../../../../shared/exceptions/bad-request.exception.js";
import { UserRepository } from "../repository/user.repository.js";

const VALID_COMBINATIONS: Record<string, string[]> = {
  CSE: ["BE", "ME"],
  IT: ["BTECH", "MTECH"],
  MECH: ["BE", "ME"],
  FT: ["BTECH"],
  CIVIL: ["BE"],
};

export class UserService {
  private readonly repository = new UserRepository();

  private mapToDto(user: any): UserResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      role: user.role?.name || "",
      departmentId: user.departmentId,
      departmentName: user.department?.name,
      programId: user.programId,
      programName: user.program?.name,
      batchId: user.batchId,
      batchName: user.batch?.name,
      loginId: user.loginId,
      registerNumber: user.registerNumber,
      employeeId: user.employeeId,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastLoginAt: user.lastLoginAt,
      createdBy: user.creator?.name,
      updatedBy: user.updater?.name,
    };
  }

  async create(data: CreateUserRequestDto, currentUserId?: string): Promise<UserResponseDto> {
    const emailExists = await this.repository.existsByEmail(data.email);
    if (emailExists) {
      throw new ConflictException("A user with this email already exists.");
    }

    const role = await this.repository.findRoleByName(data.role);
    if (!role) {
      throw new NotFoundException("Role not found.");
    }

    // Role-based logic enforcement
    let departmentId = data.departmentId;
    let programId = data.programId;
    let batchId = data.batchId;

    let loginId = "";
    let registerNumber: string | undefined = undefined;
    let employeeId: string | undefined = undefined;
    let passwordHash = "";

    if (role.name === "ADMIN") {
      departmentId = null;
      programId = null;
      batchId = null;
      
      loginId = data.email;
      if (!data.password) throw new ConflictException("Password is required for Admin");
      passwordHash = await hashPassword(data.password);
    } else if (role.name === "FACULTY") {
      programId = null;
      batchId = null;
      
      const dept = await this.repository.findDepartmentById(departmentId!);
      if (!dept) throw new NotFoundException("Department not found");

      const prefix = `${dept.code}F`;
      employeeId = await this.repository.getNextSequence(prefix, "FACULTY");
      loginId = employeeId;
      passwordHash = await hashPassword(employeeId);
    } else if (role.name === "STUDENT") {
      const dept = await this.repository.findDepartmentById(departmentId!);
      if (!dept) throw new NotFoundException("Department not found");

      const batch = await this.repository.findBatchById(batchId!);
      if (!batch) throw new NotFoundException("Batch not found");

      const program = await this.repository.findProgramById(programId!);
      if (!program) throw new NotFoundException("Program not found");

      const allowedPrograms = VALID_COMBINATIONS[dept.code];
      if (allowedPrograms && !allowedPrograms.includes(program.code)) {
        throw new BadRequestException("Selected Program is not available for this Department.");
      }

      const yy = batch.startYear ? batch.startYear.toString().slice(-2) : "00";

      const prefix = `${yy}${dept.code}`;
      registerNumber = await this.repository.getNextSequence(prefix, "STUDENT");
      loginId = registerNumber;
      passwordHash = await hashPassword(registerNumber);
    }

    const user = await this.repository.create({
      email: data.email,
      passwordHash,
      roleId: role.id,
      name: data.name,
      loginId,
      registerNumber,
      employeeId,
      phone: data.phone,
      avatarUrl: data.avatarUrl,
      departmentId: departmentId,
      programId: programId,
      batchId: batchId,
      createdBy: currentUserId,
    });

    const fullUser = await this.repository.findById(user.id);
    return this.mapToDto(fullUser);
  }

  async getAll(options?: {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
    order?: "asc" | "desc";
    role?: string;
    isActive?: boolean;
    departmentId?: string;
    programId?: string;
    batchId?: string;
  }) {
    const { data, total } = await this.repository.findAll(options);
    return {
      data: data.map(this.mapToDto),
      total,
    };
  }

  async getById(id: string): Promise<UserResponseDto> {
    const user = await this.repository.findById(id);
    if (!user) {
      throw new NotFoundException("User not found.");
    }
    return this.mapToDto(user);
  }

  async update(id: string, data: UpdateUserRequestDto, currentUserId?: string): Promise<UserResponseDto> {
    const existingUser = await this.repository.findById(id);
    if (!existingUser) {
      throw new NotFoundException("User not found.");
    }

    let roleId = existingUser.roleId;
    let roleName = existingUser.role?.name || "";

    if (data.role) {
      const role = await this.repository.findRoleByName(data.role);
      if (!role) {
        throw new NotFoundException("Role not found.");
      }
      roleId = role.id;
      roleName = role.name;
    }

    // Role-based logic enforcement
    let departmentId = data.departmentId !== undefined ? data.departmentId : existingUser.departmentId;
    let programId = data.programId !== undefined ? data.programId : existingUser.programId;
    let batchId = data.batchId !== undefined ? data.batchId : existingUser.batchId;

    if (roleName === "ADMIN") {
      departmentId = null;
      programId = null;
      batchId = null;
    } else if (roleName === "FACULTY") {
      programId = null;
      batchId = null;
    } else if (roleName === "STUDENT") {
      if (departmentId && programId) {
        const dept = await this.repository.findDepartmentById(departmentId);
        const program = await this.repository.findProgramById(programId);
        
        if (dept && program) {
          const allowedPrograms = VALID_COMBINATIONS[dept.code];
          if (allowedPrograms && !allowedPrograms.includes(program.code)) {
            throw new BadRequestException("Selected Program is not available for this Department.");
          }
        }
      }
    }

    await this.repository.update(id, {
      name: data.name,
      phone: data.phone,
      avatarUrl: data.avatarUrl,
      roleId: roleId,
      departmentId: departmentId,
      programId: programId,
      batchId: batchId,
      updatedBy: currentUserId,
    });

    const fullUser = await this.repository.findById(id);
    return this.mapToDto(fullUser);
  }

  async updateStatus(userId: string, isActive: boolean): Promise<UserResponseDto> {
    const existingUser = await this.repository.findById(userId);
    if (!existingUser) {
      throw new NotFoundException("User not found.");
    }

    if (existingUser.isActive === isActive) {
      throw new ConflictException(`User is already ${isActive ? "active" : "inactive"}.`);
    }

    await this.repository.updateStatus(userId, isActive);

    const fullUser = await this.repository.findById(userId);
    return this.mapToDto(fullUser);
  }

  async updatePassword(userId: string, passwordHash: string): Promise<UserResponseDto> {
    const existingUser = await this.repository.findById(userId);
    if (!existingUser) {
      throw new NotFoundException("User not found.");
    }
    await this.repository.updatePassword(userId, passwordHash);
    const fullUser = await this.repository.findById(userId);
    return this.mapToDto(fullUser);
  }

  async updateAdmissionId(
    userId: string,
    data: UpdateAdmissionIdRequestDto,
    currentUserId?: string
  ): Promise<UserResponseDto> {
    const existingUser = await this.repository.findById(userId);
    if (!existingUser) {
      throw new NotFoundException("User not found.");
    }

    if (existingUser.role?.name !== "STUDENT") {
      throw new ConflictException("Only students have Admission IDs.");
    }

    const isDuplicate = await this.repository.existsByLoginId(data.admissionId, userId);
    if (isDuplicate) {
      throw new ConflictException("Admission ID already exists.");
    }

    await this.repository.updateAdmissionId(userId, {
      loginId: data.admissionId,
      registerNumber: data.admissionId,
    });

    const fullUser = await this.repository.findById(userId);

    // Audit Log for Phase 10 preparation
    console.log(`[AUDIT] Admission ID Updated
Student: ${existingUser.name}
Old: ${existingUser.registerNumber}
New: ${data.admissionId}
Updated By: ${currentUserId || "System"}
Timestamp: ${new Date().toISOString()}
`);

    return this.mapToDto(fullUser);
  }

  async deleteUser(userId: string, currentUserId?: string): Promise<UserResponseDto> {
    const existingUser = await this.repository.findById(userId);
    if (!existingUser) {
      throw new NotFoundException("User not found.");
    }

    if (existingUser.role?.name === "ADMIN") {
      throw new BadRequestException("Administrator accounts cannot be deleted.");
    }

    if (userId === currentUserId) {
      throw new BadRequestException("You cannot delete your own account.");
    }

    const deletedUser = await this.repository.deleteUser(userId);
    return this.mapToDto(deletedUser);
  }

  async resetPassword(userId: string, adminPassword?: string): Promise<UserResponseDto> {
    const existingUser = await this.repository.findById(userId);
    if (!existingUser) {
      throw new NotFoundException("User not found.");
    }

    let newPassword = "";
    if (existingUser.role?.name === "STUDENT") {
      newPassword = existingUser.registerNumber || "";
    } else if (existingUser.role?.name === "FACULTY") {
      newPassword = existingUser.employeeId || "";
    } else if (existingUser.role?.name === "ADMIN") {
      if (!adminPassword) throw new ConflictException("Admin password must be provided.");
      newPassword = adminPassword;
    }

    if (!newPassword) {
      throw new ConflictException("Failed to determine default credential for reset.");
    }

    const passwordHash = await hashPassword(newPassword);
    await this.repository.updatePassword(userId, passwordHash);
    
    const fullUser = await this.repository.findById(userId);
    return this.mapToDto(fullUser);
  }

  async getOptions() {
    return this.repository.getOptions();
  }

  async getStatistics() {
    return this.repository.getStatistics();
  }
}
