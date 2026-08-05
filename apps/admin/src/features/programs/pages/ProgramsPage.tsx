import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { FormModal } from '@/components/common/FormModal';
import { PaginationControls } from '@/components/common/PaginationControls';
import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/features/auth';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { ProgramDetailsDrawer } from '../components/ProgramDetailsDrawer';
import { ProgramFilters } from '../components/ProgramFilters';
import { ProgramForm } from '../components/ProgramForm';
import { ProgramStats } from '../components/ProgramStats';
import { ProgramTable } from '../components/ProgramTable';
import {
    useCreateProgram,
    useDeleteProgram,
    useProgramStatistics,
    usePrograms,
    useToggleProgramStatus,
    useUpdateProgram,
} from '../hooks';
import type { ProgramFormValues } from '../schemas/program.schema';
import type { Program, ProgramFilters as FilterParams } from '../types/program.types';

export function ProgramsPage() {
    const { user } = useCurrentUser();
    const isAdmin = user?.role === 'ADMIN';

    // State
    const [filters, setFilters] = useState<FilterParams>({ page: 1, limit: 10, sort: 'name', order: 'asc', status: 'all', departmentId: 'all' });
    
    // Modals state
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [viewingItem, setViewingItem] = useState<Program | null>(null);
    const [editingItem, setEditingItem] = useState<Program | null>(null);
    const [deletingItem, setDeletingItem] = useState<Program | null>(null);

    // Queries
    const queryFilters = {
        page: filters.page,
        limit: filters.limit,
        search: filters.search,
        ...(filters.status !== 'all' && { isActive: filters.status === 'active' }),
        ...(filters.departmentId !== 'all' && { departmentId: filters.departmentId }),
    };

    const { data: programs = [], isLoading } = usePrograms(queryFilters);
    const { data: statsData, isLoading: isStatsLoading } = useProgramStatistics();

    const { mutate: create, isPending: isCreating } = useCreateProgram();
    const { mutate: update, isPending: isUpdating } = useUpdateProgram();
    const { mutate: remove, isPending: isDeleting } = useDeleteProgram();
    const { mutate: toggleStatus } = useToggleProgramStatus();

    const totalItems = programs.length;
    const totalPages = 1;

    // Handlers
    const handleCreate = (values: ProgramFormValues) => {
        create(values, {
            onSuccess: () => setIsCreateOpen(false),
            onError: (error: any) => {
                toast.error('Failed to create', {
                    description: error?.response?.data?.error?.message || 'An error occurred.',
                });
            },
        });
    };

    const handleUpdate = (values: ProgramFormValues) => {
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
                    description: error?.response?.data?.error?.message || 'An error occurred.',
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
                    <h1 className="mt-2 text-3xl font-semibold text-foreground">Programs</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Manage academic programs and their relationships with departments.
                    </p>
                </div>
                {isAdmin && (
                    <Button onClick={() => setIsCreateOpen(true)} className="shrink-0 gap-2">
                        <Plus className="h-4 w-4" />
                        Add Program
                    </Button>
                )}
            </div>

            {/* Stats */}
            <ProgramStats stats={statsData?.statistics} isLoading={isStatsLoading} />

            {/* Filters & Table */}
            <div className="space-y-4">
                <ProgramFilters
                    search={filters.search || ''}
                    onSearchChange={(search) => setFilters({ ...filters, search, page: 1 })}
                    status={filters.status || 'all'}
                    onStatusChange={(status) => setFilters({ ...filters, status, page: 1 })}
                    departmentId={filters.departmentId || 'all'}
                    onDepartmentChange={(departmentId) => setFilters({ ...filters, departmentId, page: 1 })}
                />
                
                <ProgramTable
                    data={programs}
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
            <ProgramDetailsDrawer
                program={viewingItem}
                open={!!viewingItem}
                onOpenChange={(open) => !open && setViewingItem(null)}
            />

            <FormModal
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                title="Create Program"
                description="Add a new program to a department."
            >
                <ProgramForm onSubmit={handleCreate} isLoading={isCreating} onCancel={() => setIsCreateOpen(false)} />
            </FormModal>

            <FormModal
                open={!!editingItem}
                onOpenChange={(open) => !open && setEditingItem(null)}
                title="Edit Program"
                description="Update the details of the program."
            >
                <ProgramForm
                    initialData={editingItem || undefined}
                    onSubmit={handleUpdate}
                    isLoading={isUpdating}
                    onCancel={() => setEditingItem(null)}
                />
            </FormModal>

            <ConfirmDialog
                open={!!deletingItem}
                onOpenChange={(open) => !open && setDeletingItem(null)}
                title="Delete Program?"
                description={`Are you sure you want to delete "${deletingItem?.name}"? This action cannot be undone.`}
                confirmLabel="Delete"
                variant="destructive"
                onConfirm={handleDelete}
                isLoading={isDeleting}
            />
        </div>
    );
}
