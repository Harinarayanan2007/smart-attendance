import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { departmentService } from '../services/department.service';
import type { UpdateDepartmentRequest } from '../types/department.types';
import { DEPARTMENTS_QUERY_KEY } from './useDepartments';

export function useUpdateDepartment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateDepartmentRequest }) =>
            departmentService.update(id, data),
        onSuccess: (_, variables) => {
            toast.success('Department Updated', {
                description: 'The department details have been updated.',
            });
            queryClient.invalidateQueries({ queryKey: DEPARTMENTS_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: [...DEPARTMENTS_QUERY_KEY, variables.id] });
        },
    });
}

export function useToggleDepartmentStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
            departmentService.updateStatus(id, isActive),
        onSuccess: (_, variables) => {
            toast.success('Status Updated', {
                description: `The department is now ${variables.isActive ? 'active' : 'inactive'}.`,
            });
            queryClient.invalidateQueries({ queryKey: DEPARTMENTS_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: [...DEPARTMENTS_QUERY_KEY, variables.id] });
        },
    });
}
