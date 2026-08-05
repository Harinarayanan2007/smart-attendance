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
import { Edit, Eye, MoreHorizontal, Power, PowerOff, Trash2 } from 'lucide-react';
import type { Department } from '../types/department.types';

interface DepartmentTableProps {
    data: Department[];
    isLoading: boolean;
    onView: (item: Department) => void;
    onEdit: (item: Department) => void;
    onDelete: (item: Department) => void;
    onToggleStatus: (item: Department) => void;
}

export function DepartmentTable({
    data,
    isLoading,
    onView,
    onEdit,
    onDelete,
    onToggleStatus,
}: DepartmentTableProps) {
    const { user } = useCurrentUser();
    const isAdmin = user?.role === 'ADMIN';

    const columns: ColumnDef<Department>[] = [
        {
            accessorKey: 'name',
            header: 'Department',
            cell: ({ row }) => (
                <div>
                    <span className="font-medium">{row.original.name}</span>
                    {row.original.description && (
                        <p className="line-clamp-1 max-w-[200px] text-xs text-muted-foreground">
                            {row.original.description}
                        </p>
                    )}
                </div>
            ),
        },
        {
            accessorKey: 'code',
            header: 'Code',
            cell: ({ row }) => (
                <span className="rounded-md border bg-muted/50 px-2 py-1 font-mono text-xs text-muted-foreground">
                    {row.original.code}
                </span>
            ),
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
                            <DropdownMenuItem onClick={() => onView(item)}>
                                <Eye className="mr-2 h-4 w-4 text-muted-foreground" />
                                View Details
                            </DropdownMenuItem>

                            {isAdmin && (
                                <>
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
                                </>
                            )}
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
            emptyMessage="No departments found."
        />
    );
}
