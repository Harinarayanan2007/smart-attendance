export function NotFoundPage() {
    return (
        <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-panel">
            <h1 className="text-2xl font-semibold text-foreground">Page not found</h1>
            <p className="mt-2 text-sm text-muted-foreground">The requested page does not exist.</p>
        </div>
    );
}
