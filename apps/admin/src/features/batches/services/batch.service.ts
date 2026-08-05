import { batchApi } from '../api/batch.api';
import type { BatchFilters, CreateBatchRequest, UpdateBatchRequest } from '../types/batch.types';

export const batchService = {
    async findAll(filters?: BatchFilters) {
        const response = await batchApi.findAll(filters);
        return response.data.data;
    },

    async findById(id: string) {
        const response = await batchApi.findById(id);
        return response.data.data;
    },

    async getOptions() {
        const response = await batchApi.getOptions();
        return response.data.data;
    },

    async create(data: CreateBatchRequest) {
        const response = await batchApi.create(data);
        return response.data.data;
    },

    async update(id: string, data: UpdateBatchRequest) {
        const response = await batchApi.update(id, data);
        return response.data.data;
    },

    async updateStatus(id: string, isActive: boolean) {
        const response = await batchApi.updateStatus(id, isActive);
        return response.data.data;
    },

    async delete(id: string) {
        const response = await batchApi.delete(id);
        return response.data.data;
    },
};
