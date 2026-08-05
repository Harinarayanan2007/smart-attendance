import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { programService } from '../services/program.service';
import { PROGRAM_OPTIONS_QUERY_KEY } from './useProgramOptions';
import { PROGRAMS_QUERY_KEY } from './usePrograms';
import { PROGRAM_STATISTICS_QUERY_KEY } from './useProgramStatistics';

export function useDeleteProgram() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => programService.delete(id),
        onSuccess: () => {
            toast.success('Program deleted successfully.');
            queryClient.invalidateQueries({ queryKey: PROGRAMS_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: PROGRAM_STATISTICS_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: PROGRAM_OPTIONS_QUERY_KEY });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to delete program.');
        },
    });
}
