import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { batchService } from '../services/batch.service';
import type { UpdateBatchRequest } from '../types/batch.types';
import { BATCHES_QUERY_KEY } from './useBatches';

export function useUpdateBatch() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateBatchRequest }) =>
            batchService.update(id, data),
        onSuccess: (_, variables) => {
            toast.success('Academic Year Updated', {
                description: 'The academic year has been updated successfully.',
            });
            queryClient.invalidateQueries({ queryKey: BATCHES_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: [...BATCHES_QUERY_KEY, variables.id] });
        },
    });
}

export function useActivateBatch() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
            batchService.updateStatus(id, isActive),
        onSuccess: (_, variables) => {
            toast.success('Status Updated', {
                description: `The academic year is now ${variables.isActive ? 'active' : 'inactive'}.`,
            });
            queryClient.invalidateQueries({ queryKey: BATCHES_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: [...BATCHES_QUERY_KEY, variables.id] });
        },
    });
}
