import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import type { DepartmentFilters } from '../types/department.types';

interface DepartmentFilterControlsProps {
    filters: DepartmentFilters;
    onChange: (filters: DepartmentFilters) => void;
}

export function DepartmentFilterControls({ filters, onChange }: DepartmentFilterControlsProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [debouncedSearch] = useDebounce(searchTerm, 300);

    useEffect(() => {
        onChange({ ...filters, search: debouncedSearch, page: 1 });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch]);

    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Search by name or code..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                />
            </div>
            
            <div className="flex items-center gap-2">
                <select
                    className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    value={filters.isActive === undefined ? 'all' : filters.isActive.toString()}
                    onChange={(e) => {
                        const val = e.target.value;
                        onChange({
                            ...filters,
                            isActive: val === 'all' ? undefined : val === 'true',
                            page: 1,
                        });
                    }}
                >
                    <option value="all">All Status</option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                </select>

                <select
                    className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    value={filters.sort || 'name'}
                    onChange={(e) => {
                        onChange({
                            ...filters,
                            sort: e.target.value as DepartmentFilters['sort'],
                            page: 1,
                        });
                    }}
                >
                    <option value="name">Sort by Name</option>
                    <option value="code">Sort by Code</option>
                    <option value="createdAt">Sort by Created Date</option>
                </select>
            </div>
        </div>
    );
}
