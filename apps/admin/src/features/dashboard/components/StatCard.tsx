import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import type { ReactNode } from 'react';

interface StatCardProps {
    title: string;
    value?: number | string;
    icon: ReactNode;
    isLoading?: boolean;
    isError?: boolean;
}

export function StatCard({ title, value, icon, isLoading, isError }: StatCardProps) {
    return (
        <Card className="flex items-center gap-4 p-5 transition-colors hover:bg-muted/50">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                {icon}
            </div>
            <div>
                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                {isLoading ? (
                    <div className="mt-1 flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Loading...</span>
                    </div>
                ) : isError ? (
                    <p className="mt-1 text-sm font-medium text-rose-500">Error</p>
                ) : (
                    <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
                )}
            </div>
        </Card>
    );
}
