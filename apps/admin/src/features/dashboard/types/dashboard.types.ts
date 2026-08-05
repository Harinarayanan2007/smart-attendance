export interface DashboardSummary {
    batches: number;
    departments: number;
    programs: number;
    users: number;
    activeUsers: number;
    activeBatchName: string;
}

export interface DashboardSummaryResponse {
    success: boolean;
    data: DashboardSummary;
    timestamp: string;
}

export type HealthStatus = 'healthy' | 'degraded' | 'down';

export interface SystemHealth {
    status: HealthStatus;
    database: string;
    version: string;
    timestamp: string;
}

export interface HealthResponse {
    success: boolean;
    data: {
        database: string;
    };
    timestamp: string;
}

export interface ActivityItemType {
    id: string;
    title: string;
    timeAgo: string;
    icon: React.ElementType;
}
