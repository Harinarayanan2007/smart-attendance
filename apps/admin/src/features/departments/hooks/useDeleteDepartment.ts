import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { departmentService } from '../services/department.service';
import { DEPARTMENTS_QUERY_KEY } from './useDepartments';

export function useDeleteDepartment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: departmentService.delete,
        onSuccess: () => {
            toast.success('Deleted Successfully', {
                description: 'The department has been removed.',
            });
            queryClient.invalidateQueries({ queryKey: DEPARTMENTS_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: ['dashboard', 'summary'] });
        },
    });
}
