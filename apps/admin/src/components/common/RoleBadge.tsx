import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Shield, ShieldAlert, User } from 'lucide-react';

interface RoleBadgeProps {
  role: string;
  className?: string;
  showIcon?: boolean;
}

export function RoleBadge({ role, className, showIcon = true }: RoleBadgeProps) {
  const roleUpper = role?.toUpperCase();

  let variant: 'default' | 'destructive' | 'outline' | 'secondary' = 'default';
  let Icon = User;
  let colorClass = '';

  switch (roleUpper) {
    case 'ADMIN':
      variant = 'destructive'; // Red-ish by default in shadcn
      Icon = ShieldAlert;
      colorClass = 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300';
      break;
    case 'FACULTY':
      variant = 'default';
      Icon = Shield;
      colorClass = 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300';
      break;
    case 'STUDENT':
      variant = 'secondary';
      Icon = User;
      colorClass = 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300';
      break;
    default:
      variant = 'outline';
      Icon = User;
  }

  return (
    <Badge variant={variant} className={cn('gap-1', colorClass, className)}>
      {showIcon && <Icon className="h-3 w-3" />}
      {roleUpper || 'UNKNOWN'}
    </Badge>
  );
}
