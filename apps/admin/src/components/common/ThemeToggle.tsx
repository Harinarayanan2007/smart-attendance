import { Button } from '@/components/ui/button';
import { useThemeStore, type ThemeMode } from '@/store/theme-store';
import { Monitor, Moon, Sun } from 'lucide-react';

const options: Array<{ value: ThemeMode; label: string; icon: typeof Sun }> = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
];

export function ThemeToggle() {
    const { mode, setMode } = useThemeStore();

    return (
        <div className="flex items-center gap-2 rounded-full border border-border bg-muted p-1">
            {options.map(({ value, label, icon: Icon }) => (
                <Button
                    key={value}
                    variant={mode === value ? 'default' : 'ghost'}
                    size="sm"
                    className="rounded-full"
                    onClick={() => setMode(value)}
                >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{label}</span>
                </Button>
            ))}
        </div>
    );
}
