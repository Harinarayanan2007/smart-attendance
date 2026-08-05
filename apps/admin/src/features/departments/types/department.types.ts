export interface Department {
    id: string;
    name: string;
    code: string;
    description: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateDepartmentRequest {
    name: string;
    code: string;
    description?: string | null;
    isActive?: boolean;
}

export interface UpdateDepartmentRequest {
    name?: string;
    code?: string;
    description?: string | null;
    isActive?: boolean;
}

export interface DepartmentFilters {
    search?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
    sort?: 'name' | 'code' | 'createdAt';
    order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
}

export interface SingleResponse<T> {
    success: boolean;
    data: T;
}
