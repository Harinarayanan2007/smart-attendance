import { useQuery } from '@tanstack/react-query';
import { departmentService } from '../services/department.service';
import { DEPARTMENTS_QUERY_KEY } from './useDepartments';

export function useDepartment(id: string) {
    return useQuery({
        queryKey: [...DEPARTMENTS_QUERY_KEY, id],
        queryFn: () => departmentService.findById(id),
        enabled: !!id,
    });
}
