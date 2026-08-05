import { StatCard } from '@/features/dashboard/components/StatCard';
import { ShieldAlert, ShieldCheck, UserCheck, Users } from 'lucide-react';
import { UserStatistics } from '../types/user.types';

interface UserStatsProps {
  stats?: UserStatistics;
  isLoading: boolean;
}

export function UserStats({ stats, isLoading }: UserStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <StatCard
        title="Total Users"
        value={stats?.totalUsers || 0}
        icon={<Users className="h-5 w-5" />}
        isLoading={isLoading}
      />
      <StatCard
        title="Admins"
        value={stats?.admins || 0}
        icon={<ShieldAlert className="h-5 w-5" />}
        isLoading={isLoading}
      />
      <StatCard
        title="Faculty"
        value={stats?.faculty || 0}
        icon={<ShieldCheck className="h-5 w-5" />}
        isLoading={isLoading}
      />
      <StatCard
        title="Students"
        value={stats?.students || 0}
        icon={<Users className="h-5 w-5" />}
        isLoading={isLoading}
      />
      <StatCard
        title="Active / Inactive"
        value={`${stats?.active || 0} / ${stats?.inactive || 0}`}
        icon={<UserCheck className="h-5 w-5" />}
        isLoading={isLoading}
      />
    </div>
  );
}
