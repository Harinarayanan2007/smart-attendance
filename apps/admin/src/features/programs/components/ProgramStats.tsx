import { StatCard } from '@/features/dashboard/components/StatCard';
import { BookOpen, Building2, CheckCircle2, XCircle } from 'lucide-react';
import type { ProgramStatistics } from '../types/program.types';

interface ProgramStatsProps {
    stats?: ProgramStatistics;
    isLoading?: boolean;
}

export function ProgramStats({ stats, isLoading }: ProgramStatsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
                title="Total Programs"
                value={stats?.totalPrograms || 0}
                icon={<BookOpen className="h-6 w-6" />}
                isLoading={isLoading}
            />
            
            <StatCard
                title="Active Programs"
                value={stats?.activePrograms || 0}
                icon={<CheckCircle2 className="h-6 w-6" />}
                isLoading={isLoading}
            />
            
            <StatCard
                title="Inactive Programs"
                value={stats?.inactivePrograms || 0}
                icon={<XCircle className="h-6 w-6" />}
                isLoading={isLoading}
            />

        </div>
    );
}
