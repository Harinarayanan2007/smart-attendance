import { ThemeToggle } from '@/components/common/ThemeToggle';
import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { useLogout } from '@/features/auth/hooks/useLogout';
import { cn } from '@/lib/utils';
import {
    BookOpen,
    Building2,
    ChevronRight,
    GraduationCap,
    LayoutDashboard,
    LogOut,
    Menu,
    ShieldCheck,
    UserCog,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

const navigationGroups = [
    {
        title: 'Dashboard',
        items: [{ to: '/dashboard', label: 'Overview', icon: LayoutDashboard }],
    },
    {
        title: 'Academic Management',
        items: [
            { to: '/batches', label: 'Batches', icon: BookOpen },
            { to: '/departments', label: 'Departments', icon: Building2 },
            { to: '/programs', label: 'Programs', icon: GraduationCap },
        ],
    },
    {
        title: 'User Management',
        items: [{ to: '/users', label: 'Users', icon: UserCog }],
    },
];

export function AdminLayout() {
    const { logout } = useLogout();
    const { user } = useCurrentUser();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    // Close sidebar on mobile when navigating
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    // Prevent body scroll when sidebar is open on mobile
    useEffect(() => {
        if (isSidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isSidebarOpen]);

    const currentRouteLabel = navigationGroups
        .flatMap((g) => g.items)
        .find((item) => location.pathname.startsWith(item.to))?.label;

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <div className="flex min-h-screen">
                {/* Sidebar */}
                <aside
                    className={cn(
                        'fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-card transition-transform duration-300 lg:static lg:translate-x-0',
                        isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
                    )}
                >
                    <div className="flex items-center justify-between p-6">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-primary p-2 text-primary-foreground">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-foreground">Smart Attendance</p>
                                <p className="text-xs text-muted-foreground">Admin Console</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <X className="h-5 w-5" />
                            <span className="sr-only">Close sidebar</span>
                        </Button>
                    </div>

                    <div className="flex-1 overflow-y-auto px-4 py-2">
                        {navigationGroups.map((group, index) => (
                            <div key={group.title} className={cn('mb-6', index !== 0 && 'mt-6')}>
                                <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    {group.title}
                                </p>
                                <nav className="space-y-1">
                                    {group.items.map(({ to, label, icon: Icon }) => (
                                        <NavLink
                                            key={to}
                                            to={to}
                                            className={({ isActive }) =>
                                                cn(
                                                    'group flex items-center justify-between rounded-lg px-2 py-2 text-sm font-medium transition-colors',
                                                    isActive
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                                                )
                                            }
                                        >
                                            {({ isActive }) => (
                                                <>
                                                    <div className="flex items-center gap-3">
                                                        <Icon
                                                            className={cn(
                                                                'h-4 w-4 shrink-0 transition-colors',
                                                                isActive
                                                                    ? 'text-primary-foreground'
                                                                    : 'text-muted-foreground group-hover:text-foreground',
                                                            )}
                                                        />
                                                        {label}
                                                    </div>
                                                    {isActive && <ChevronRight className="h-4 w-4 opacity-50" />}
                                                </>
                                            )}
                                        </NavLink>
                                    ))}
                                </nav>
                            </div>
                        ))}
                    </div>

                    {/* Sidebar footer — user info */}
                    {user && (
                        <div className="border-t border-border p-4">
                            <div className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                                    {(user.loginId || 'U').charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium text-foreground">{user.loginId || 'Unknown User'}</p>
                                    <p className="text-xs capitalize text-muted-foreground">{user.role.toLowerCase()}</p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={logout} className="shrink-0 text-muted-foreground hover:text-rose-500">
                                    <LogOut className="h-4 w-4" />
                                    <span className="sr-only">Logout</span>
                                </Button>
                            </div>
                        </div>
                    )}
                </aside>

                <div className="flex flex-1 flex-col min-w-0">
                    {/* Header */}
                    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-border bg-card/80 px-4 backdrop-blur-md sm:px-6">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="lg:hidden"
                                onClick={() => setIsSidebarOpen(true)}
                            >
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Open sidebar</span>
                            </Button>

                            <div className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
                                <span>Administration</span>
                                <ChevronRight className="h-4 w-4" />
                                <span className="font-medium text-foreground">{currentRouteLabel}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-4">
                            <ThemeToggle />
                            
                            {user && (
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground sm:hidden">
                                    {(user.loginId || 'U').charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                    </header>

                    {/* Main Content */}
                    <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
}
