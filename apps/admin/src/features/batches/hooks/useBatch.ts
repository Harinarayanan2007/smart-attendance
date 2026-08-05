import { useQuery } from '@tanstack/react-query';
import { batchService } from '../services/batch.service';
import { BATCHES_QUERY_KEY } from './useBatches';

export function useBatch(id: string) {
    return useQuery({
        queryKey: [...BATCHES_QUERY_KEY, id],
        queryFn: () => batchService.findById(id),
        enabled: !!id,
    });
}
