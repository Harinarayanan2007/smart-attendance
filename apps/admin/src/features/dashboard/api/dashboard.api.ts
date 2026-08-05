import { request } from '@/services/api';
import type { DashboardSummaryResponse, HealthResponse } from '../types/dashboard.types';

export const dashboardApi = {
    getSummary: () => {
        return request<DashboardSummaryResponse>({
            url: '/dashboard/summary',
            method: 'GET',
        });
    },

    getHealth: () => {
        return request<HealthResponse>({
            url: '/health',
            method: 'GET',
        });
    },
};
