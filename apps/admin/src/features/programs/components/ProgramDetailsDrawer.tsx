import { format } from 'date-fns';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import type { Program } from '../types/program.types';

interface ProgramDetailsDrawerProps {
    program: Program | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ProgramDetailsDrawer({
    program,
    open,
    onOpenChange,
}: ProgramDetailsDrawerProps) {
    if (!program) return null;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                <SheetHeader className="mb-6">
                    <SheetTitle>Program Details</SheetTitle>
                    <SheetDescription>
                        View comprehensive details for this program.
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-6">
                    <div className="flex justify-between items-start border-b pb-4">
                        <div>
                            <h3 className="font-semibold text-lg">{program.name}</h3>
                            <p className="text-sm text-muted-foreground">Code: {program.code}</p>
                        </div>
                        <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                program.isActive
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}
                        >
                            {program.isActive ? 'Active' : 'Inactive'}
                        </span>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-1">
                                Duration
                            </h4>
                            <p className="text-sm">{program.durationYears} Year(s)</p>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-1">
                                Description
                            </h4>
                            <p className="text-sm whitespace-pre-wrap">
                                {program.description || 'No description provided.'}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 border-t pt-4">
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                                    Created Date
                                </h4>
                                <p className="text-sm">
                                    {format(new Date(program.createdAt), 'PPpp')}
                                </p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                                    Last Updated
                                </h4>
                                <p className="text-sm">
                                    {format(new Date(program.updatedAt), 'PPpp')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
