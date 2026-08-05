import { useDepartmentOptions } from '@/features/departments/hooks/useDepartmentOptions';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';

interface ProgramFiltersProps {
    search: string;
    onSearchChange: (value: string) => void;
    status: string;
    onStatusChange: (value: string) => void;
    departmentId: string;
    onDepartmentChange: (value: string) => void;
}

export function ProgramFilters({
    search,
    onSearchChange,
    status,
    onStatusChange,
    departmentId,
    onDepartmentChange,
}: ProgramFiltersProps) {
    const { data: departmentOptions = [] } = useDepartmentOptions();

    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search programs..."
                    className="pl-8"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>
            
            <Select value={departmentId} onValueChange={onDepartmentChange}>
                <SelectTrigger className="w-full md:w-[220px]">
                    <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departmentOptions.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                            {dept.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select value={status} onValueChange={onStatusChange}>
                <SelectTrigger className="w-full md:w-[150px]">
                    <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
