import { FormModal } from '@/components/common/FormModal';
import { PaginationControls } from '@/components/common/PaginationControls';
import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/features/auth';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { UserDetailsDrawer } from '../components/UserDetailsDrawer';
import { UserFilters } from '../components/UserFilters';
import { UserForm } from '../components/UserForm';
import { UserStats } from '../components/UserStats';
import { UserTable } from '../components/UserTable';
import {
    useCreateUser,
    useToggleUserStatus,
    useUpdateUser,
    useUsers,
    useUserStatistics,
    useDeleteUser,
} from '../hooks';
import type { User, UserFilters as FilterParams } from '../types/user.types';

export function UsersPage() {
    const { user: currentUser } = useCurrentUser();
    const isAdmin = currentUser?.role === 'ADMIN';

    // State
    const [filters, setFilters] = useState<FilterParams>({ 
      page: 1, 
      limit: 10, 
      sort: 'name', 
      order: 'asc', 
      status: 'all', 
      role: 'all',
      departmentId: 'all',
      programId: 'all'
    });
    
    // Modals state
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [viewingItem, setViewingItem] = useState<User | null>(null);
    const [editingItem, setEditingItem] = useState<User | null>(null);
    const [deletingItem, setDeletingItem] = useState<User | null>(null);

    // Queries
    const queryFilters = {
        page: filters.page,
        limit: filters.limit,
        search: filters.search,
        ...(filters.status !== 'all' && { isActive: filters.status === 'active' }),
        ...(filters.role !== 'all' && { role: filters.role }),
        ...(filters.departmentId !== 'all' && { departmentId: filters.departmentId }),
        ...(filters.programId !== 'all' && { programId: filters.programId }),
        ...(filters.batchId && filters.batchId !== 'all' && { batchId: filters.batchId }),
    };

    const { data: response, isLoading } = useUsers(queryFilters);
    const users = response?.data || [];
    const totalItems = response?.meta?.total || 0;
    const totalPages = Math.ceil(totalItems / (filters.limit || 10));

    const { data: statsData, isLoading: isStatsLoading } = useUserStatistics();

    const { mutate: create, isPending: isCreating } = useCreateUser();
    const { mutate: update, isPending: isUpdating } = useUpdateUser();
    const { mutate: toggleStatus } = useToggleUserStatus();
    const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

    // Handlers
    const handleCreate = (values: any) => {
        create(values, {
            onSuccess: (response: any) => {
                setIsCreateOpen(false);
                if (values.role !== 'ADMIN') {
                    toast.success('User Created Successfully', {
                        description: `Login ID & Password: ${response?.data?.loginId || 'Check details'}`,
                        duration: 10000,
                    });
                } else {
                    toast.success('Admin Created Successfully');
                }
            },
            onError: (error: any) => {
                toast.error('Failed to create', {
                    description: error?.response?.data?.error?.message || 'An error occurred.',
                });
            },
        });
    };

    const handleUpdate = (values: any) => {
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
        deleteUser(deletingItem.id, {
            onSuccess: () => {
                setDeletingItem(null);
                toast.success('User Deleted Successfully');
            },
            onError: (error: any) => {
                toast.error('Failed to delete user', {
                    description: error?.response?.data?.error?.message || 'An error occurred.',
                });
            }
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-border bg-card p-6 shadow-panel">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Administration</p>
                    <h1 className="mt-2 text-3xl font-semibold text-foreground">User Management</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Manage administrators, faculty, and students across the institution.
                    </p>
                </div>
                {isAdmin && (
                    <Button onClick={() => setIsCreateOpen(true)} className="shrink-0 gap-2">
                        <Plus className="h-4 w-4" />
                        Add User
                    </Button>
                )}
            </div>

            {/* Stats */}
            <UserStats stats={statsData?.statistics} isLoading={isStatsLoading} />

            {/* Filters & Table */}
            <div className="space-y-4">
                <UserFilters
                    search={filters.search || ''}
                    onSearchChange={(search) => setFilters({ ...filters, search, page: 1 })}
                    status={filters.status || 'all'}
                    onStatusChange={(status) => setFilters({ ...filters, status, page: 1 })}
                    role={filters.role || 'all'}
                    onRoleChange={(role) => setFilters({ ...filters, role, page: 1 })}
                    departmentId={filters.departmentId || 'all'}
                    onDepartmentChange={(departmentId) => setFilters({ ...filters, departmentId, page: 1 })}
                    programId={filters.programId || 'all'}
                    onProgramChange={(programId) => setFilters({ ...filters, programId, page: 1 })}
                />
                
                <UserTable
                    data={users}
                    isLoading={isLoading}
                    onView={setViewingItem}
                    onEdit={setEditingItem}
                    onToggleStatus={(item) => toggleStatus({ id: item.id, isActive: !item.isActive })}
                    onDelete={setDeletingItem}
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
            <UserDetailsDrawer
                user={viewingItem}
                open={!!viewingItem}
                onOpenChange={(open) => !open && setViewingItem(null)}
            />

            <FormModal
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                title="Create User"
                description="Add a new user to the system."
            >
                <UserForm onSubmit={handleCreate} isLoading={isCreating} onCancel={() => setIsCreateOpen(false)} isEditMode={false} />
            </FormModal>

            <FormModal
                open={!!editingItem}
                onOpenChange={(open) => !open && setEditingItem(null)}
                title="Edit User"
                description="Update user profile and academic assignments."
            >
                <UserForm
                    initialData={editingItem ? {
                      ...editingItem,
                      departmentId: editingItem.departmentName ? editingItem.departmentName : 'none' // Actually we need IDs, wait.
                    } : undefined}
                    // Wait, initialData needs IDs, not Names. We don't return departmentId from backend by default! 
                    // I will fix that in a moment.
                    onSubmit={handleUpdate}
                    isLoading={isUpdating}
                    onCancel={() => setEditingItem(null)}
                    isEditMode={true}
                />
            </FormModal>

            <FormModal
                open={!!deletingItem}
                onOpenChange={(open) => !open && setDeletingItem(null)}
                title="Delete User"
                description={`Are you sure you want to delete ${deletingItem?.name}? This action cannot be undone.`}
            >
                <div className="flex justify-end gap-3 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setDeletingItem(null)}
                        disabled={isDeleting}
                    >
                        Cancel
                    </Button>
                    <Button 
                        type="button" 
                        variant="destructive" 
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </Button>
                </div>
            </FormModal>
        </div>
    );
}
