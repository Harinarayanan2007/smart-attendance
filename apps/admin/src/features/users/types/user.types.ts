export interface SingleResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  loginId: string;
  registerNumber?: string | null;
  employeeId?: string | null;
  phone?: string | null;
  avatarUrl?: string | null;
  role: string;
  departmentId?: string | null;
  departmentName?: string | null;
  programId?: string | null;
  programName?: string | null;
  batchId?: string | null;
  batchName?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
}

export interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  role?: string;
  status?: string;
  departmentId?: string;
  programId?: string;
  batchId?: string;
}

export interface UserStatistics {
  totalUsers: number;
  admins: number;
  faculty: number;
  students: number;
  active: number;
  inactive: number;
  departmentCount: number;
  programCount: number;
}
