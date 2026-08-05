import { request } from '@/services/api';
import type { Option } from '@/types';
import type {
    CreateDepartmentRequest,
    Department,
    DepartmentFilters,
    PaginatedResponse,
    SingleResponse,
    UpdateDepartmentRequest,
} from '../types/department.types';

export const departmentApi = {
    findAll: (params?: DepartmentFilters) => {
        return request<PaginatedResponse<Department>>({
            url: '/departments',
            method: 'GET',
            params,
        });
    },

    findById: (id: string) => {
        return request<SingleResponse<Department>>({
            url: `/departments/${id}`,
            method: 'GET',
        });
    },

    getOptions: () => {
        return request<SingleResponse<Option[]>>({
            url: '/departments/options',
            method: 'GET',
        });
    },

    create: (data: CreateDepartmentRequest) => {
        return request<SingleResponse<Department>>({
            url: '/departments',
            method: 'POST',
            data,
        });
    },

    update: (id: string, data: UpdateDepartmentRequest) => {
        return request<SingleResponse<Department>>({
            url: `/departments/${id}`,
            method: 'PATCH',
            data,
        });
    },

    updateStatus: (id: string, isActive: boolean) => {
        return request<SingleResponse<Department>>({
            url: `/departments/${id}/status`,
            method: 'PATCH',
            data: { isActive },
        });
    },

    delete: (id: string) => {
        return request<SingleResponse<Department>>({
            url: `/departments/${id}`,
            method: 'DELETE',
        });
    },
};
