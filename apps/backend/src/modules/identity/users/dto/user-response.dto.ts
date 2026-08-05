export interface UserResponseDto {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  avatarUrl?: string | null;
  role: string;
  departmentId?: string | null;
  departmentName?: string | null;
  programId?: string | null;
  programName?: string | null;
  batchId?: string | null;
  batchName?: string | null;
  loginId: string;
  registerNumber?: string | null;
  employeeId?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date | null;
  createdBy?: string | null;
  updatedBy?: string | null;
}
