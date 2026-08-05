import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { batchService } from '../services/batch.service';
import { BATCHES_QUERY_KEY } from './useBatches';

export function useCreateBatch() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: batchService.create,
        onSuccess: () => {
            toast.success('Academic Year Created', {
                description: 'The new academic year has been added successfully.',
            });
            queryClient.invalidateQueries({ queryKey: BATCHES_QUERY_KEY });
        },
    });
}
