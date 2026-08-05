import { cn } from '@/lib/utils';
import type { HealthStatus } from '../types/dashboard.types';

interface HealthBadgeProps {
    status?: HealthStatus;
    label: string;
}

export function HealthBadge({ status = 'down', label }: HealthBadgeProps) {
    return (
        <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <span className="text-sm font-medium text-foreground">{label}</span>
            <div className="flex items-center gap-2">
                <div
                    className={cn(
                        'h-2.5 w-2.5 rounded-full',
                        status === 'healthy' ? 'bg-emerald-500' : status === 'degraded' ? 'bg-amber-500' : 'bg-rose-500',
                    )}
                />
                <span className="text-sm capitalize text-muted-foreground">{status}</span>
            </div>
        </div>
    );
}
