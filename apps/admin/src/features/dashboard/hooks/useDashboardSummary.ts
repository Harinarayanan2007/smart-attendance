import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboard.service';

export function useDashboardSummary() {
    return useQuery({
        queryKey: ['dashboard', 'summary'],
        queryFn: () => dashboardService.getSummary(),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}
