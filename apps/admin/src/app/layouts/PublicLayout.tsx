import { Outlet } from 'react-router-dom';

export function PublicLayout() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <main className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6 py-10">
                <Outlet />
            </main>
        </div>
    );
}
