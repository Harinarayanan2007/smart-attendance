import { useQuery } from '@tanstack/react-query';
import { programService } from '../services/program.service';

export const PROGRAM_STATISTICS_QUERY_KEY = ['program-statistics'];

export function useProgramStatistics() {
    return useQuery({
        queryKey: PROGRAM_STATISTICS_QUERY_KEY,
        queryFn: () => programService.getStatistics(),
    });
}
