import { useQuery } from '@tanstack/react-query';
import { batchService } from '../services/batch.service';

export const BATCH_OPTIONS_QUERY_KEY = ['batch-options'];

export function useBatchOptions() {
    return useQuery({
        queryKey: BATCH_OPTIONS_QUERY_KEY,
        queryFn: () => batchService.getOptions(),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}
