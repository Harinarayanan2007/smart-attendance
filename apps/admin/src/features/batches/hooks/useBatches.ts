import { useQuery } from '@tanstack/react-query';
import { batchService } from '../services/batch.service';
import type { BatchFilters } from '../types/batch.types';

export const BATCHES_QUERY_KEY = ['batches'];

export function useBatches(filters?: BatchFilters) {
    return useQuery({
        queryKey: [...BATCHES_QUERY_KEY, filters],
        queryFn: () => batchService.findAll(filters),
    });
}
