import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboard.service';

export function useHealth() {
    return useQuery({
        queryKey: ['dashboard', 'health'],
        queryFn: () => dashboardService.getHealth(),
        refetchInterval: 1000 * 60, // Refetch every minute
    });
}
