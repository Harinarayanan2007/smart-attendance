interface LoadingStateProps {
    label?: string;
}

export function LoadingState({ label = 'Loading...' }: LoadingStateProps) {
    return (
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground shadow-panel">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-foreground" />
            {label}
        </div>
    );
}
