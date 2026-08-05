import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDepartmentOptions } from '@/features/departments/hooks';
import { useProgramOptions } from '@/features/programs/hooks';
import { Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface UserFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  role: string;
  onRoleChange: (value: string) => void;
  departmentId: string;
  onDepartmentChange: (value: string) => void;
  programId: string;
  onProgramChange: (value: string) => void;
}

export function UserFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  role,
  onRoleChange,
  departmentId,
  onDepartmentChange,
  programId,
  onProgramChange,
}: UserFiltersProps) {
  const [searchValue, setSearchValue] = useState(search);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(searchValue);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchValue, onSearchChange]);

  const { data: departmentOptions } = useDepartmentOptions();
  // We can filter programs by department ID in the query, but our hook currently takes no args.
  // Actually, we updated our backend to accept departmentId! Let's assume the hook takes it.
  const { data: programOptions } = useProgramOptions(departmentId !== 'all' ? departmentId : undefined);

  const hasActiveFilters = search !== '' || status !== 'all' || role !== 'all' || departmentId !== 'all' || programId !== 'all';

  const clearFilters = () => {
    setSearchValue('');
    onSearchChange('');
    onStatusChange('all');
    onRoleChange('all');
    onDepartmentChange('all');
    onProgramChange('all');
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-sm md:flex-row md:items-center md:flex-wrap">
      <div className="relative flex-1 md:min-w-[250px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search users by name or email..."
          className="pl-9"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Select value={role} onValueChange={onRoleChange}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="FACULTY">Faculty</SelectItem>
            <SelectItem value="STUDENT">Student</SelectItem>
          </SelectContent>
        </Select>

        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Select 
          value={departmentId} 
          onValueChange={(val) => {
            onDepartmentChange(val);
            // Reset program when department changes
            onProgramChange('all');
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departmentOptions?.map((dept) => (
              <SelectItem key={dept.id} value={dept.id}>
                {dept.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={programId} onValueChange={onProgramChange} disabled={departmentId === 'all' && (!programOptions || programOptions.length === 0)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Program" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Programs</SelectItem>
            {programOptions?.map((prog) => (
              <SelectItem key={prog.id} value={prog.id}>
                {prog.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="ghost" onClick={clearFilters} className="px-2">
            <X className="h-4 w-4 mr-1" /> Clear
          </Button>
        )}
      </div>
    </div>
  );
}
