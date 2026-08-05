import { dashboardApi } from '../api/dashboard.api';
import type { DashboardSummary, SystemHealth } from '../types/dashboard.types';

export const dashboardService = {
    async getSummary(): Promise<DashboardSummary> {
        const response = await dashboardApi.getSummary();
        return response.data.data;
    },

    async getHealth(): Promise<SystemHealth> {
        try {
            const response = await dashboardApi.getHealth();
            return {
                status: 'healthy',
                database: response.data.data.database,
                version: import.meta.env.VITE_APP_VERSION || '1.0.0',
                timestamp: response.data.timestamp,
            };
        } catch {
            return {
                status: 'down',
                database: 'disconnected',
                version: import.meta.env.VITE_APP_VERSION || '1.0.0',
                timestamp: new Date().toISOString(),
            };
        }
    },
};
