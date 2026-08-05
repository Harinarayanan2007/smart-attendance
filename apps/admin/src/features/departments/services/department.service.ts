import { departmentApi } from '../api/department.api';
import type { CreateDepartmentRequest, DepartmentFilters, UpdateDepartmentRequest } from '../types/department.types';

export const departmentService = {
    async findAll(filters?: DepartmentFilters) {
        const response = await departmentApi.findAll(filters);
        return response.data.data;
    },

    async findById(id: string) {
        const response = await departmentApi.findById(id);
        return response.data.data;
    },

    async getOptions() {
        const response = await departmentApi.getOptions();
        return response.data.data;
    },

    async create(data: CreateDepartmentRequest) {
        const response = await departmentApi.create(data);
        return response.data.data;
    },

    async update(id: string, data: UpdateDepartmentRequest) {
        const response = await departmentApi.update(id, data);
        return response.data.data;
    },

    async updateStatus(id: string, isActive: boolean) {
        const response = await departmentApi.updateStatus(id, isActive);
        return response.data.data;
    },

    async delete(id: string) {
        const response = await departmentApi.delete(id);
        return response.data.data;
    },
};
