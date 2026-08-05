import { useQuery } from '@tanstack/react-query';
import { departmentService } from '../services/department.service';

export const DEPARTMENT_OPTIONS_QUERY_KEY = ['department-options'];

export function useDepartmentOptions() {
    return useQuery({
        queryKey: DEPARTMENT_OPTIONS_QUERY_KEY,
        queryFn: () => departmentService.getOptions(),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}
