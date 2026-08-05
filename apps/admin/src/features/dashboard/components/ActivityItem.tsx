import type { ActivityItemType } from '../types/dashboard.types';

export function ActivityItem({ title, timeAgo, icon: Icon }: ActivityItemType) {
    return (
        <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground">{timeAgo}</p>
            </div>
        </div>
    );
}
