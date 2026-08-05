import { StatCard } from '@/features/dashboard/components/StatCard';
import { CheckCircle2, Factory, XCircle } from 'lucide-react';
import type { Department } from '../types/department.types';

interface DepartmentStatsProps {
    data?: Department[];
    isLoading?: boolean;
}

export function DepartmentStats({ data = [], isLoading }: DepartmentStatsProps) {
    const activeDepartments = data.filter((d) => d.isActive).length;
    const inactiveDepartments = data.filter((d) => !d.isActive).length;

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <StatCard
                title="Total Displayed"
                value={data.length}
                icon={<Factory className="h-6 w-6" />}
                isLoading={isLoading}
            />
            <StatCard
                title="Active"
                value={activeDepartments}
                icon={<CheckCircle2 className="h-6 w-6" />}
                isLoading={isLoading}
            />
            <StatCard
                title="Inactive"
                value={inactiveDepartments}
                icon={<XCircle className="h-6 w-6" />}
                isLoading={isLoading}
            />
        </div>
    );
}
