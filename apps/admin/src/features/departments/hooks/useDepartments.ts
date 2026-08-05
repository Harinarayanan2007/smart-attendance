import { useQuery } from '@tanstack/react-query';
import { departmentService } from '../services/department.service';
import type { DepartmentFilters } from '../types/department.types';

export const DEPARTMENTS_QUERY_KEY = ['departments'];

export function useDepartments(filters?: DepartmentFilters) {
    return useQuery({
        queryKey: [...DEPARTMENTS_QUERY_KEY, filters],
        queryFn: () => departmentService.findAll(filters),
    });
}
