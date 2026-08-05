export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    status: 'active' | 'inactive';
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
}

export interface PaginationResponse<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
}

export interface Batch {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    status: 'active' | 'inactive';
}

export interface Department {
    id: string;
    name: string;
    code: string;
    status: 'active' | 'inactive';
}

export interface Program {
    id: string;
    name: string;
    code: string;
    status: 'active' | 'inactive';
}

export interface Option {
    id: string;
    name: string;
}
