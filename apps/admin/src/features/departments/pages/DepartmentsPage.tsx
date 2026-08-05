import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { FormModal } from '@/components/common/FormModal';
import { PaginationControls } from '@/components/common/PaginationControls';
import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/features/auth';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { DepartmentDetailsDrawer } from '../components/DepartmentDetailsDrawer';
import { DepartmentFilterControls } from '../components/DepartmentFilters';
import { DepartmentForm } from '../components/DepartmentForm';
import { DepartmentStats } from '../components/DepartmentStats';
import { DepartmentTable } from '../components/DepartmentTable';
import {
    useCreateDepartment,
    useDeleteDepartment,
    useDepartments,
    useToggleDepartmentStatus,
    useUpdateDepartment,
} from '../hooks';
import type { DepartmentFormValues } from '../schemas/department.schema';
import type { Department, DepartmentFilters } from '../types/department.types';

export function DepartmentsPage() {
    const { user } = useCurrentUser();
    const isAdmin = user?.role === 'ADMIN';

    // State
    const [filters, setFilters] = useState<DepartmentFilters>({ page: 1, limit: 10, sort: 'name', order: 'asc' });
    
    // Modals state
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [viewingItem, setViewingItem] = useState<Department | null>(null);
    const [editingItem, setEditingItem] = useState<Department | null>(null);
    const [deletingItem, setDeletingItem] = useState<Department | null>(null);

    // Queries
    const { data: departmentsResponse, isLoading } = useDepartments(filters);
    const { mutate: create, isPending: isCreating } = useCreateDepartment();
    const { mutate: update, isPending: isUpdating } = useUpdateDepartment();
    const { mutate: remove, isPending: isDeleting } = useDeleteDepartment();
    const { mutate: toggleStatus } = useToggleDepartmentStatus();

    const departments = departmentsResponse || [];
    const totalItems = departments.length;
    const totalPages = 1; // Backend doesn't provide total items for proper pagination UI in boilerplate shape yet.

    // Handlers
    const handleCreate = (values: DepartmentFormValues) => {
        create(values, {
            onSuccess: () => setIsCreateOpen(false),
            onError: (error: any) => {
                toast.error('Failed to create', {
                    description: error?.response?.data?.error?.message || 'An error occurred.',
                });
            },
        });
    };

    const handleUpdate = (values: DepartmentFormValues) => {
        if (!editingItem) return;
        update(
            { id: editingItem.id, data: values },
            {
                onSuccess: () => setEditingItem(null),
                onError: (error: any) => {
                    toast.error('Failed to update', {
                        description: error?.response?.data?.error?.message || 'An error occurred.',
                    });
                },
            },
        );
    };

    const handleDelete = () => {
        if (!deletingItem) return;
        remove(deletingItem.id, {
            onSuccess: () => setDeletingItem(null),
            onError: (error: any) => {
                toast.error('Failed to delete', {
                    description: error?.response?.data?.error?.message || 'An error occurred. Check if programs exist under this department.',
                });
            },
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-border bg-card p-6 shadow-panel">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Administration</p>
                    <h1 className="mt-2 text-3xl font-semibold text-foreground">Departments</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Manage academic departments and their properties.
                    </p>
                </div>
                {isAdmin && (
                    <Button onClick={() => setIsCreateOpen(true)} className="shrink-0 gap-2">
                        <Plus className="h-4 w-4" />
                        Add Department
                    </Button>
                )}
            </div>

            {/* Stats */}
            <DepartmentStats data={departments} isLoading={isLoading} />

            {/* Filters & Table */}
            <div className="space-y-4">
                <DepartmentFilterControls filters={filters} onChange={setFilters} />
                <DepartmentTable
                    data={departments}
                    isLoading={isLoading}
                    onView={setViewingItem}
                    onEdit={setEditingItem}
                    onDelete={setDeletingItem}
                    onToggleStatus={(item) => toggleStatus({ id: item.id, isActive: !item.isActive })}
                />
                
                <PaginationControls
                    currentPage={filters.page || 1}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    pageSize={filters.limit || 10}
                    onPageChange={(page) => setFilters({ ...filters, page })}
                />
            </div>

            {/* Modals & Drawers */}
            <DepartmentDetailsDrawer
                department={viewingItem}
                open={!!viewingItem}
                onOpenChange={(open) => !open && setViewingItem(null)}
            />

            <FormModal
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                title="Create Department"
                description="Add a new department to the system."
            >
                <DepartmentForm onSubmit={handleCreate} isLoading={isCreating} onCancel={() => setIsCreateOpen(false)} />
            </FormModal>

            <FormModal
                open={!!editingItem}
                onOpenChange={(open) => !open && setEditingItem(null)}
                title="Edit Department"
                description="Update the details of the department."
            >
                <DepartmentForm
                    initialValues={editingItem || undefined}
                    onSubmit={handleUpdate}
                    isLoading={isUpdating}
                    onCancel={() => setEditingItem(null)}
                />
            </FormModal>

            <ConfirmDialog
                open={!!deletingItem}
                onOpenChange={(open) => !open && setDeletingItem(null)}
                title="Delete Department?"
                description={`Are you sure you want to delete "${deletingItem?.name}"? This action cannot be undone and will fail if there are active programs under it.`}
                confirmLabel="Delete"
                variant="destructive"
                onConfirm={handleDelete}
                isLoading={isDeleting}
            />
        </div>
    );
}
