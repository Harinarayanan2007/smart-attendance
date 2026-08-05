import { Card } from '@/components/ui/card';
import { DashboardSkeleton } from '@/features/dashboard/components/DashboardSkeleton';
import { HealthBadge } from '@/features/dashboard/components/HealthBadge';
import { QuickActionButton } from '@/features/dashboard/components/QuickActionButton';
import { StatCard } from '@/features/dashboard/components/StatCard';
import { useDashboardSummary } from '@/features/dashboard/hooks/useDashboardSummary';
import { useHealth } from '@/features/dashboard/hooks/useHealth';
import { Building2, GraduationCap, UserCheck } from 'lucide-react';

export function DashboardPage() {
    const { data: summary, isLoading: isLoadingSummary, isError: isErrorSummary } = useDashboardSummary();
    const { data: health, isLoading: isLoadingHealth } = useHealth();

    if (isLoadingSummary && isLoadingHealth) {
        return <DashboardSkeleton />;
    }

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-panel">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Overview</p>
                <h1 className="mt-2 text-3xl font-semibold text-foreground">Dashboard</h1>
                <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
                    Monitor institutional statistics, manage modules, and check system health.
                </p>
            </div>

            {/* Statistics Grid */}
            <div className="grid gap-4 md:grid-cols-2">
                <StatCard
                    title="Departments"
                    value={summary?.departments}
                    icon={<Building2 className="h-6 w-6" />}
                    isLoading={isLoadingSummary}
                    isError={isErrorSummary}
                />
                <StatCard
                    title="Programs"
                    value={summary?.programs}
                    icon={<GraduationCap className="h-6 w-6" />}
                    isLoading={isLoadingSummary}
                    isError={isErrorSummary}
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Left Column: Quick Actions */}
                <div className="col-span-2 space-y-6">
                    <Card className="p-6 shadow-panel">
                        <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            <QuickActionButton label="Add Academic Year" to="/batches" />
                            <QuickActionButton label="Add Department" to="/departments" />
                            <QuickActionButton label="Add Program" to="/programs" />
                            <QuickActionButton label="Add User" to="/users" />
                        </div>
                    </Card>
                </div>

                {/* Right Column: Academic Summary & System Health */}
                <div className="space-y-6">
                    <Card className="p-6 shadow-panel">
                        <h2 className="text-lg font-semibold text-foreground">Academic Summary</h2>
                        <div className="mt-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Current Year</span>
                                <span className="text-sm font-medium text-foreground">{summary?.activeBatchName ?? 'None'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Status</span>
                                {summary?.activeBatchName && summary.activeBatchName !== 'No Active Batch' ? (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                        Active
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-2 py-0.5 text-xs font-medium text-rose-600 dark:text-rose-400">
                                        <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                                        Inactive
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Active Users</span>
                                <span className="flex items-center gap-1 text-sm font-medium text-foreground">
                                    <UserCheck className="h-4 w-4 text-emerald-500" />
                                    {summary?.activeUsers ?? 0}
                                </span>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 shadow-panel">
                        <h2 className="text-lg font-semibold text-foreground">System Health</h2>
                        <div className="mt-6 space-y-3">
                            <HealthBadge
                                label="Backend API"
                                status={isLoadingHealth ? undefined : health?.status}
                            />
                            <HealthBadge
                                label="Database"
                                status={isLoadingHealth ? undefined : (health?.database === 'connected' ? 'healthy' : 'down')}
                            />
                            <div className="flex items-center justify-between rounded-lg border border-border p-3">
                                <span className="text-sm font-medium text-foreground">Version</span>
                                <span className="text-sm text-muted-foreground">
                                    v{health?.version ?? '1.0.0'}
                                </span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
