import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
    mode: ThemeMode;
    setMode: (mode: ThemeMode) => void;
}

/** Resolve "system" to the actual OS preference. */
function resolveTheme(mode: ThemeMode): 'light' | 'dark' {
    if (mode !== 'system') return mode;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/** Apply or remove the `dark` class on <html>. */
function applyTheme(mode: ThemeMode) {
    const resolved = resolveTheme(mode);
    document.documentElement.classList.toggle('dark', resolved === 'dark');
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            mode: 'system',
            setMode: (mode) => {
                applyTheme(mode);
                set({ mode });
            },
        }),
        {
            name: 'smart-attendance-theme',
            onRehydrateStorage: () => (state) => {
                // Apply the persisted theme as soon as the store rehydrates.
                if (state) applyTheme(state.mode);
            },
        },
    ),
);

// Listen for OS theme changes when mode is "system".
if (typeof window !== 'undefined') {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        const { mode } = useThemeStore.getState();
        if (mode === 'system') applyTheme('system');
    });
}
