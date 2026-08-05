export interface Batch {
    id: string;
    name: string;
    startYear: number;
    endYear: number;
    allowAdmissions: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateBatchRequest {
    startYear: number;
    isActive?: boolean;
}

export interface UpdateBatchRequest {
    startYear?: number;
    isActive?: boolean;
}

export interface BatchFilters {
    search?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
    sort?: 'name' | 'startYear' | 'endYear' | 'createdAt';
    order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    timestamp: string;
}

export interface SingleResponse<T> {
    success: boolean;
    data: T;
    timestamp: string;
}
