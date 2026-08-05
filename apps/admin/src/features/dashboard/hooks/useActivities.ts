import { BookOpen, Building2, UserPlus } from 'lucide-react';
import type { ActivityItemType } from '../types/dashboard.types';

// Dummy data for now. Will be replaced by backend API later.
const dummyActivities: ActivityItemType[] = [
    {
        id: '1',
        title: 'Department "Computer Science" Created',
        timeAgo: '2 min ago',
        icon: Building2,
    },
    {
        id: '2',
        title: 'Program "BSc AI" Updated',
        timeAgo: '8 min ago',
        icon: BookOpen,
    },
    {
        id: '3',
        title: 'User "john.doe@example.com" Created',
        timeAgo: '12 min ago',
        icon: UserPlus,
    },
];

export function useActivities() {
    // Return a mocked useQuery-like object for consistency
    return {
        data: dummyActivities,
        isLoading: false,
        isError: false,
    };
}
