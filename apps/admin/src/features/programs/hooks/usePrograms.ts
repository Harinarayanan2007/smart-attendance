import { useQuery } from '@tanstack/react-query';
import { programService } from '../services/program.service';
import type { ProgramFilters } from '../types/program.types';

export const PROGRAMS_QUERY_KEY = ['programs'];

export function usePrograms(filters?: ProgramFilters) {
    return useQuery({
        queryKey: [...PROGRAMS_QUERY_KEY, filters],
        queryFn: () => programService.findAll(filters),
    });
}
