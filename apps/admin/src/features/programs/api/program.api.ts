import { request } from '@/services/api';
import type { Option } from '@/types';
import type {
    CreateProgramRequest,
    Program,
    ProgramFilters,
    ProgramStatsResponse,
    SingleResponse,
    UpdateProgramRequest,
} from '../types/program.types';

export const programApi = {
    findAll: (filters?: ProgramFilters) => {
        return request<SingleResponse<Program[]>>({
            url: '/programs',
            method: 'GET',
            params: filters,
        });
    },

    findById: (id: string) => {
        return request<SingleResponse<Program>>({
            url: `/programs/${id}`,
            method: 'GET',
        });
    },

    getOptions: () => {
        return request<SingleResponse<Option[]>>({
            url: '/programs/options',
            method: 'GET',
        });
    },

    getStatistics: () => {
        return request<SingleResponse<ProgramStatsResponse>>({
            url: '/programs/statistics',
            method: 'GET',
        });
    },

    create: (data: CreateProgramRequest) => {
        return request<SingleResponse<Program>>({
            url: '/programs',
            method: 'POST',
            data,
        });
    },

    update: (id: string, data: UpdateProgramRequest) => {
        return request<SingleResponse<Program>>({
            url: `/programs/${id}`,
            method: 'PATCH',
            data,
        });
    },

    updateStatus: (id: string, isActive: boolean) => {
        return request<SingleResponse<Program>>({
            url: `/programs/${id}/status`,
            method: 'PATCH',
            data: { isActive },
        });
    },

    delete: (id: string) => {
        return request<SingleResponse<Program>>({
            url: `/programs/${id}`,
            method: 'DELETE',
        });
    },
};
