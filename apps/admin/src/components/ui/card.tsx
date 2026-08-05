import { cn } from '@/lib/utils';
import { forwardRef, type HTMLAttributes } from 'react';

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn('rounded-xl border border-border bg-card text-card-foreground shadow-panel', className)} {...props} />
));

Card.displayName = 'Card';
