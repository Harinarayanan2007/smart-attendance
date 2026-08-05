import { StatusBadge } from '@/components/common/Badges';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCurrentUser } from '@/features/auth';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Edit, MoreHorizontal, Power, PowerOff, Trash2 } from 'lucide-react';
import type { Batch } from '../types/batch.types';

interface BatchTableProps {
    data: Batch[];
    isLoading: boolean;
    onEdit: (item: Batch) => void;
    onDelete: (item: Batch) => void;
    onToggleStatus: (item: Batch) => void;
}

export function BatchTable({
    data,
    isLoading,
    onEdit,
    onDelete,
    onToggleStatus,
}: BatchTableProps) {
    const { user } = useCurrentUser();
    const isAdmin = user?.role === 'ADMIN';

    const columns: ColumnDef<Batch>[] = [
        {
            accessorKey: 'name',
            header: 'Batch Name',
            cell: ({ row }) => <span className="font-semibold text-primary">{row.original.name}</span>,
        },
        {
            accessorKey: 'startYear',
            header: 'Start Year',
            cell: ({ row }) => <span className="font-medium">{row.original.startYear}</span>,
        },
        {
            accessorKey: 'endYear',
            header: 'End Year',
            cell: ({ row }) => <span className="font-medium">{row.original.endYear}</span>,
        },
        {
            accessorKey: 'isActive',
            header: 'Status',
            cell: ({ row }) => <StatusBadge isActive={row.original.isActive} />,
        },
        {
            accessorKey: 'createdAt',
            header: 'Created',
            cell: ({ row }) => format(new Date(row.original.createdAt), 'MMM d, yyyy'),
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                const item = row.original;

                // Only ADMIN can perform actions
                if (!isAdmin) return null;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onEdit(item)}>
                                <Edit className="mr-2 h-4 w-4 text-muted-foreground" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onToggleStatus(item)}>
                                {item.isActive ? (
                                    <>
                                        <PowerOff className="mr-2 h-4 w-4 text-muted-foreground" />
                                        Deactivate
                                    </>
                                ) : (
                                    <>
                                        <Power className="mr-2 h-4 w-4 text-muted-foreground" />
                                        Activate
                                    </>
                                )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => onDelete(item)}
                                className="text-rose-500 focus:bg-rose-500/10 focus:text-rose-500"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    return (
        <DataTable
            columns={columns}
            data={data}
            isLoading={isLoading}
            emptyMessage="No batches found."
        />
    );
}
