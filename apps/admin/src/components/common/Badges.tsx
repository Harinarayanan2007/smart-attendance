import { Badge } from '@/components/ui/badge';

export function StatusBadge({ isActive }: { isActive: boolean }) {
    return (
        <Badge
            variant="outline"
            className={
                isActive
                    ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'border-muted-foreground/20 bg-muted-foreground/10 text-muted-foreground'
            }
        >
            {isActive ? 'Active' : 'Inactive'}
        </Badge>
    );
}

export function CurrentBadge({ isCurrent }: { isCurrent: boolean }) {
    if (!isCurrent) return null;
    return (
        <Badge
            variant="outline"
            className="border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400"
        >
            Current
        </Badge>
    );
}
