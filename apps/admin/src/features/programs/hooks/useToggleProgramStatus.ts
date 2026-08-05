import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { programService } from '../services/program.service';
import { PROGRAM_OPTIONS_QUERY_KEY } from './useProgramOptions';
import { PROGRAMS_QUERY_KEY } from './usePrograms';
import { PROGRAM_STATISTICS_QUERY_KEY } from './useProgramStatistics';

export function useToggleProgramStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
            programService.updateStatus(id, isActive),
        onSuccess: (_, variables) => {
            toast.success(variables.isActive ? 'Program activated.' : 'Program deactivated.');
            queryClient.invalidateQueries({ queryKey: PROGRAMS_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: [...PROGRAMS_QUERY_KEY, variables.id] });
            queryClient.invalidateQueries({ queryKey: PROGRAM_STATISTICS_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: PROGRAM_OPTIONS_QUERY_KEY });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to update status.');
        },
    });
}
