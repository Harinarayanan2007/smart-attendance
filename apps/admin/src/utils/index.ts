export function formatDate(value: string | Date) {
    const date = typeof value === 'string' ? new Date(value) : value;
    return new Intl.DateTimeFormat('en', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(date);
}

export function getStorageItem<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined') return fallback;
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
}

export function setStorageItem<T>(key: string, value: T) {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(key, JSON.stringify(value));
}

export function debounce<T extends (...args: unknown[]) => void>(fn: T, delay = 300) {
    let timer: ReturnType<typeof setTimeout> | undefined;
    return (...args: Parameters<T>) => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}
