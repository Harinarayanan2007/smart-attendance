import { StatusBadge } from '@/components/common/Badges';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from '@/components/ui/drawer';
import { format } from 'date-fns';
import { Building2, X } from 'lucide-react';
import type { Department } from '../types/department.types';

interface DepartmentDetailsDrawerProps {
    department: Department | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function DepartmentDetailsDrawer({ department, open, onOpenChange }: DepartmentDetailsDrawerProps) {
    if (!department) return null;

    return (
        <Drawer open={open} onOpenChange={onOpenChange} direction="right">
            <DrawerContent className="fixed inset-y-0 right-0 mt-0 h-full w-[400px] rounded-none outline-none">
                <div className="flex h-full flex-col">
                    <DrawerHeader className="border-b text-left">
                        <div className="flex items-center justify-between">
                            <DrawerTitle className="flex items-center gap-2 text-xl">
                                <Building2 className="h-5 w-5 text-muted-foreground" />
                                Department Details
                            </DrawerTitle>
                            <DrawerClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                                <X className="h-4 w-4" />
                                <span className="sr-only">Close</span>
                            </DrawerClose>
                        </div>
                        <DrawerDescription>Comprehensive view of the department's records.</DrawerDescription>
                    </DrawerHeader>

                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Department Name</h4>
                                <p className="mt-1 text-base font-semibold">{department.name}</p>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Department Code</h4>
                                <div className="mt-1">
                                    <span className="rounded-md border bg-muted/50 px-2 py-1 font-mono text-sm">
                                        {department.code}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                                <div className="mt-1">
                                    <StatusBadge isActive={department.isActive} />
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
                                <p className="mt-1 text-sm leading-relaxed">
                                    {department.description || <span className="italic text-muted-foreground">No description provided.</span>}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted/50 p-4">
                                <div>
                                    <h4 className="text-xs font-medium text-muted-foreground">Created At</h4>
                                    <p className="mt-1 text-sm">{format(new Date(department.createdAt), 'PPp')}</p>
                                </div>
                                <div>
                                    <h4 className="text-xs font-medium text-muted-foreground">Updated At</h4>
                                    <p className="mt-1 text-sm">{format(new Date(department.updatedAt), 'PPp')}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <DrawerFooter className="border-t">
                        <DrawerClose asChild>
                            <button className="w-full rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                                Close
                            </button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
