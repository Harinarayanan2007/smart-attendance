interface ErrorStateProps {
    title?: string;
    message?: string;
}

export function ErrorState({ title = 'Something went wrong', message = 'Please try again shortly.' }: ErrorStateProps) {
    return (
        <div className="rounded-2xl border border-rose-300 bg-rose-50 p-6 text-sm text-rose-700 shadow-panel dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-400">
            <p className="font-semibold">{title}</p>
            <p className="mt-1">{message}</p>
        </div>
    );
}
