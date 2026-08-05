import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { batchService } from '../services/batch.service';
import { BATCHES_QUERY_KEY } from './useBatches';

export function useDeleteBatch() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: batchService.delete,
        onSuccess: () => {
            toast.success('Deleted Successfully', {
                description: 'The academic year has been removed.',
            });
            queryClient.invalidateQueries({ queryKey: BATCHES_QUERY_KEY });
            // Also invalidate the dashboard summary
            queryClient.invalidateQueries({ queryKey: ['dashboard', 'summary'] });
        },
    });
}
