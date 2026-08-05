export interface Program {
    id: string;
    name: string;
    code: string;
    durationYears: number;
    description: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateProgramRequest {
    name: string;
    code: string;
    durationYears: number;
    description?: string | null;
    isActive?: boolean;
}

export interface UpdateProgramRequest {
    name?: string;
    code?: string;
    durationYears?: number;
    description?: string | null;
    isActive?: boolean;
}

export interface ProgramFilters {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
    order?: 'asc' | 'desc';
    isActive?: boolean;
    status?: string;
}

export interface ProgramStatistics {
    totalPrograms: number;
    activePrograms: number;
    inactivePrograms: number;
}

export interface ProgramStatsResponse {
    statistics: ProgramStatistics;
    timestamp: string;
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    // TODO: if backend adds pagination metadata, update here
}

export interface SingleResponse<T> {
    success: boolean;
    data: T;
}
