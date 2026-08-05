import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuickActionButtonProps {
    label: string;
    to: string;
}

export function QuickActionButton({ label, to }: QuickActionButtonProps) {
    const navigate = useNavigate();

    return (
        <Button variant="outline" className="w-full justify-start gap-3" onClick={() => navigate(to)}>
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Plus className="h-4 w-4" />
            </div>
            {label}
        </Button>
    );
}
