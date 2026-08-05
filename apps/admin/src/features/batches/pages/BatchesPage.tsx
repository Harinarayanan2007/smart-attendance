import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { FormModal } from '@/components/common/FormModal';
import { PaginationControls } from '@/components/common/PaginationControls';
import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/features/auth';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { BatchFilterControls as FiltersComponent } from '../components/BatchFilters';
import { BatchForm } from '../components/BatchForm';
import { BatchStats } from '../components/BatchStats';
import { BatchTable } from '../components/BatchTable';
import {
    useBatches,
    useActivateBatch,
    useCreateBatch,
    useDeleteBatch,
    useUpdateBatch,
} from '../hooks';
import type { BatchFormValues } from '../schemas/batch.schema';
import type { Batch, BatchFilters } from '../types/batch.types';

export function BatchesPage() {
    const { user } = useCurrentUser();
    const isAdmin = user?.role === 'ADMIN';

    // State
    const [filters, setFilters] = useState<BatchFilters>({ page: 1, limit: 10, sort: 'name', order: 'desc' });
    
    // Modals state
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Batch | null>(null);
    const [deletingItem, setDeletingItem] = useState<Batch | null>(null);

    // Queries
    const { data: paginatedResponse, isLoading } = useBatches(filters);
    const { mutate: create, isPending: isCreating } = useCreateBatch();
    const { mutate: update, isPending: isUpdating } = useUpdateBatch();
    const { mutate: remove, isPending: isDeleting } = useDeleteBatch();
    const { mutate: toggleStatus } = useActivateBatch();

    const batches = paginatedResponse || [];
    // Currently backend paginated endpoint might not return total items/pages in this boilerplate shape.
    // If it doesn't, we'll assume next page exists if data.length === limit.
    const totalItems = batches.length; // Fallback
    const totalPages = 1; // Fallback

    // Handlers
    const handleCreate = (values: BatchFormValues) => {
        create(values, {
            onSuccess: () => setIsCreateOpen(false),
            onError: (error: any) => {
                toast.error('Failed to create', {
                    description: error?.response?.data?.error?.message || 'An error occurred.',
                });
            },
        });
    };

    const handleUpdate = (values: BatchFormValues) => {
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
                    <h1 className="mt-2 text-3xl font-semibold text-foreground">Batches</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Manage batches and programs.
                    </p>
                </div>
                {isAdmin && (
                    <Button onClick={() => setIsCreateOpen(true)} className="shrink-0 gap-2">
                        <Plus className="h-4 w-4" />
                        Add Batch
                    </Button>
                )}
            </div>

            {/* Stats */}
            <BatchStats data={batches} isLoading={isLoading} />

            {/* Filters & Table */}
            <div className="space-y-4">
                <FiltersComponent filters={filters} onChange={setFilters} />
                <BatchTable
                    data={batches}
                    isLoading={isLoading}
                    onEdit={setEditingItem}
                    onDelete={setDeletingItem}
                    onToggleStatus={(item) => toggleStatus({ id: item.id, isActive: !item.isActive })}
                />
                
                {/* Fallback pagination controls. Backend might need total count support to be fully accurate */}
                <PaginationControls
                    currentPage={filters.page || 1}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    pageSize={filters.limit || 10}
                    onPageChange={(page) => setFilters({ ...filters, page })}
                />
            </div>

            {/* Modals */}
            <FormModal
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                title="Create Batch"
                description="Add a new batch to the system."
            >
                <BatchForm onSubmit={handleCreate} isLoading={isCreating} onCancel={() => setIsCreateOpen(false)} />
            </FormModal>

            <FormModal
                open={!!editingItem}
                onOpenChange={(open) => !open && setEditingItem(null)}
                title="Edit Batch"
                description="Update the details of the batch."
            >
                <BatchForm
                    initialValues={editingItem || undefined}
                    onSubmit={handleUpdate}
                    isLoading={isUpdating}
                    onCancel={() => setEditingItem(null)}
                />
            </FormModal>

            <ConfirmDialog
                open={!!deletingItem}
                onOpenChange={(open) => !open && setDeletingItem(null)}
                title="Delete Batch?"
                description={`Are you sure you want to delete "${deletingItem?.name}"? This action cannot be undone.`}
                confirmLabel="Delete"
                variant="destructive"
                onConfirm={handleDelete}
                isLoading={isDeleting}
            />

        </div>
    );
}
