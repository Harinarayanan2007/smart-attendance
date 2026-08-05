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
import { type ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { ArrowUpDown, Edit, Eye, MoreHorizontal, Power, PowerOff, Trash } from 'lucide-react';
import type { Program } from '../types/program.types';

interface ProgramTableProps {
    data: Program[];
    onEdit: (program: Program) => void;
    onView: (program: Program) => void;
    onToggleStatus: (program: Program) => void;
    onDelete: (program: Program) => void;
    isLoading?: boolean;
}

export function ProgramTable({
    data,
    onEdit,
    onView,
    onToggleStatus,
    onDelete,
    isLoading,
}: ProgramTableProps) {
    const columns: ColumnDef<Program>[] = [
        {
            accessorKey: 'name',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Program Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
        },
        {
            accessorKey: 'code',
            header: 'Code',
        },

        {
            accessorKey: 'durationYears',
            header: 'Duration (Years)',
        },
        {
            accessorKey: 'isActive',
            header: 'Status',
            cell: ({ row }) => {
                const isActive = row.getValue('isActive') as boolean;
                return (
                    <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            isActive
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}
                    >
                        {isActive ? 'Active' : 'Inactive'}
                    </span>
                );
            },
        },
        {
            accessorKey: 'createdAt',
            header: 'Created Date',
            cell: ({ row }) => {
                return format(new Date(row.getValue('createdAt')), 'MMM d, yyyy');
            },
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                const program = row.original;

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
                            <DropdownMenuItem onClick={() => onView(program)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit(program)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onToggleStatus(program)}>
                                {program.isActive ? (
                                    <>
                                        <PowerOff className="mr-2 h-4 w-4 text-orange-500" />
                                        Deactivate
                                    </>
                                ) : (
                                    <>
                                        <Power className="mr-2 h-4 w-4 text-green-500" />
                                        Activate
                                    </>
                                )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => onDelete(program)}
                                className="text-red-600 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950"
                            >
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    return <DataTable columns={columns} data={data} isLoading={isLoading} />;
}
