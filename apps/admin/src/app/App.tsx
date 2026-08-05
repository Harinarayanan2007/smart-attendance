import { useSession } from '@/features/auth/hooks/useSession';
import { Loader2 } from 'lucide-react';
import { Outlet } from 'react-router-dom';

export function App() {
    const { isReady } = useSession();

    if (!isReady) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return <Outlet />;
}
