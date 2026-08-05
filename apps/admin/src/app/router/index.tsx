import { App } from '@/app/App';
import { AdminLayout } from '@/app/layouts/AdminLayout';
import { PublicLayout } from '@/app/layouts/PublicLayout';
import { ProtectedRoute } from '@/app/router/ProtectedRoute';
import { ROLES } from '@/constants';
import { BatchesPage } from '@/features/batches/pages/BatchesPage';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { AccessDeniedPage } from '@/features/auth/pages/AccessDeniedPage';
import { NotFoundPage } from '@/features/auth/pages/NotFoundPage';
import { UnauthorizedPage } from '@/features/auth/pages/UnauthorizedPage';
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage';
import { DepartmentsPage } from '@/features/departments/pages/DepartmentsPage';
import { ProgramsPage } from '@/features/programs/pages/ProgramsPage';
import { UsersPage } from '@/features/users/pages/UsersPage';
import { createBrowserRouter, Navigate } from 'react-router-dom';

export const router = createBrowserRouter([
    {
        element: <App />,
        children: [
            {
                element: <PublicLayout />,
                children: [
                    { path: '/', element: <Navigate to="/login" replace /> },
                    { path: '/login', element: <LoginPage /> },
                    { path: '/unauthorized', element: <UnauthorizedPage /> },
                    { path: '/access-denied', element: <AccessDeniedPage /> },
                ],
            },
            {
                element: <AdminLayout />,
                children: [
                    {
                        path: '/dashboard',
                        element: (
                            <ProtectedRoute allowedRoles={[ROLES.admin, ROLES.faculty]}>
                                <DashboardPage />
                            </ProtectedRoute>
                        ),
                    },
                    {
                        path: '/batches',
                        element: (
                            <ProtectedRoute allowedRoles={[ROLES.admin]}>
                                <BatchesPage />
                            </ProtectedRoute>
                        ),
                    },
                    {
                        path: '/departments',
                        element: (
                            <ProtectedRoute allowedRoles={[ROLES.admin]}>
                                <DepartmentsPage />
                            </ProtectedRoute>
                        ),
                    },
                    {
                        path: '/programs',
                        element: (
                            <ProtectedRoute allowedRoles={[ROLES.admin]}>
                                <ProgramsPage />
                            </ProtectedRoute>
                        ),
                    },
                    {
                        path: '/users',
                        element: (
                            <ProtectedRoute allowedRoles={[ROLES.admin]}>
                                <UsersPage />
                            </ProtectedRoute>
                        ),
                    },
                    { path: '*', element: <NotFoundPage /> },
                ],
            },
        ],
    },
]);
