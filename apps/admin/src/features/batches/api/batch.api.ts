import { request } from '@/services/api';
import type { Option } from '@/types';
import type {
    Batch,
    BatchFilters,
    CreateBatchRequest,
    PaginatedResponse,
    SingleResponse,
    UpdateBatchRequest,
} from '../types/batch.types';

export const batchApi = {
    findAll: (params?: BatchFilters) => {
        return request<PaginatedResponse<Batch>>({
            url: '/batches',
            method: 'GET',
            params,
        });
    },

    findById: (id: string) => {
        return request<SingleResponse<Batch>>({
            url: `/batches/${id}`,
            method: 'GET',
        });
    },

    getOptions: () => {
        return request<SingleResponse<Option[]>>({
            url: '/batches/options',
            method: 'GET',
        });
    },

    create: (data: CreateBatchRequest) => {
        return request<SingleResponse<Batch>>({
            url: '/batches',
            method: 'POST',
            data,
        });
    },

    update: (id: string, data: UpdateBatchRequest) => {
        return request<SingleResponse<Batch>>({
            url: `/batches/${id}`,
            method: 'PATCH',
            data,
        });
    },

    updateStatus: (id: string, isActive: boolean) => {
        return request<SingleResponse<Batch>>({
            url: `/batches/${id}/status`,
            method: 'PATCH',
            data: { isActive },
        });
    },

    delete: (id: string) => {
        return request<SingleResponse<Batch>>({
            url: `/batches/${id}`,
            method: 'DELETE',
        });
    },
};
