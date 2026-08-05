import { Card } from '@/components/ui/card';

export function DashboardSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            <Card className="h-32 bg-muted/50 p-6" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i} className="h-24 bg-muted/50 p-5" />
                ))}
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="col-span-2 h-96 bg-muted/50 p-6" />
                <Card className="h-96 bg-muted/50 p-6" />
            </div>
        </div>
    );
}
