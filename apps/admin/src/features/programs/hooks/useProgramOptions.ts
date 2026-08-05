import { useQuery } from '@tanstack/react-query';
import { programService } from '../services/program.service';

export const PROGRAM_OPTIONS_QUERY_KEY = ['program-options'];

export function useProgramOptions() {
    return useQuery({
        queryKey: PROGRAM_OPTIONS_QUERY_KEY,
        queryFn: () => programService.getOptions(),
        staleTime: 5 * 60 * 1000,
    });
}
