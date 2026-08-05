import { StatCard } from '@/features/dashboard/components/StatCard';
import { BookOpen, Calendar, CheckCircle2, XCircle } from 'lucide-react';
import type { Batch } from '../types/batch.types';

interface BatchStatsProps {
    data?: Batch[];
    isLoading?: boolean;
}

export function BatchStats({ data = [], isLoading }: BatchStatsProps) {
    // In a real app, these stats might come from a dedicated summary endpoint or be derived from the paginated result if we get full list.
    // For now, since we only have the paginated slice, deriving stats from the current page isn't totally accurate for the whole system,
    // but we'll show it as an example. Ideally we'd fetch a summary. Let's just use the length of data for demonstration.
    const activeBatches = data.filter((y) => y.isActive).length;
    const inactiveBatches = data.filter((y) => !y.isActive).length;
    // TODO: Fetch real students count from backend
    const totalStudents = 0;

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
                title="Total Batches"
                value={data.length}
                icon={<BookOpen className="h-6 w-6" />}
                isLoading={isLoading}
            />
            <StatCard
                title="Total Students"
                value={totalStudents}
                icon={<Calendar className="h-6 w-6" />}
                isLoading={isLoading}
            />
            <StatCard
                title="Active"
                value={activeBatches}
                icon={<CheckCircle2 className="h-6 w-6" />}
                isLoading={isLoading}
            />
            <StatCard
                title="Inactive"
                value={inactiveBatches}
                icon={<XCircle className="h-6 w-6" />}
                isLoading={isLoading}
            />
        </div>
    );
}
