import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { departmentService } from '../services/department.service';
import { DEPARTMENTS_QUERY_KEY } from './useDepartments';

export function useCreateDepartment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: departmentService.create,
        onSuccess: () => {
            toast.success('Department Created', {
                description: 'The new department has been added successfully.',
            });
            queryClient.invalidateQueries({ queryKey: DEPARTMENTS_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: ['dashboard', 'summary'] });
        },
    });
}
