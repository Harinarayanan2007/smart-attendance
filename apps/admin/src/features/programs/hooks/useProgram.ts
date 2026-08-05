import { useQuery } from '@tanstack/react-query';
import { programService } from '../services/program.service';
import { PROGRAMS_QUERY_KEY } from './usePrograms';

export function useProgram(id: string) {
    return useQuery({
        queryKey: [...PROGRAMS_QUERY_KEY, id],
        queryFn: () => programService.findById(id),
        enabled: !!id,
    });
}
