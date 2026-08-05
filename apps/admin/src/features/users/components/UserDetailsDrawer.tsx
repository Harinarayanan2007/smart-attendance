import { RoleBadge } from '@/components/common/RoleBadge';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { format } from 'date-fns';
import { Calendar, Hash, Mail, MapPin, Phone, Pencil } from 'lucide-react';
import { useState } from 'react';
import { useCurrentUser } from '@/features/auth';
import { Button } from '@/components/ui/button';
import { User } from '../types/user.types';
import { EditAdmissionIdDialog } from './EditAdmissionIdDialog';
import { useResetPassword } from '../hooks';
import { toast } from 'sonner';

interface UserDetailsDrawerProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserDetailsDrawer({ user, open, onOpenChange }: UserDetailsDrawerProps) {
  const { user: currentUser } = useCurrentUser();
  const isAdmin = currentUser?.role === 'ADMIN';
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { mutate: resetPassword, isPending: isResetting } = useResetPassword();

  const handleResetPassword = () => {
    if (confirm(`Are you sure you want to reset the password for ${user?.name}?`)) {
      resetPassword({ id: user!.id }, {
        onSuccess: () => toast.success('Password Reset', { description: 'Password reset to default credential successfully.' }),
        onError: () => toast.error('Failed to Reset', { description: 'Could not reset password.' }),
      });
    }
  };

  if (!user) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="text-left space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatarUrl || undefined} />
              <AvatarFallback className="text-xl">{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <SheetTitle className="text-2xl">{user.name}</SheetTitle>
              <SheetDescription className="flex items-center gap-2 mt-1">
                <RoleBadge role={user.role} />
                <StatusBadge isActive={user.isActive} />
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-8 space-y-6">
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Contact Information</h4>
            <div className="grid gap-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{user.phone || 'No phone number provided'}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Academic Information</h4>
            <div className="grid gap-3">
              <div className="flex items-center gap-3 text-sm">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium w-24">Login ID:</span>
                <span className="text-muted-foreground">{user.loginId}</span>
              </div>
              {user.employeeId && (
                <div className="flex items-center gap-3 text-sm">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium w-24">Employee ID:</span>
                  <span className="text-muted-foreground">{user.employeeId}</span>
                </div>
              )}
              {user.registerNumber && (
                <div className="flex items-center gap-3 text-sm">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium w-24">Register No:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{user.registerNumber}</span>
                    {isAdmin && user.role === 'STUDENT' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-foreground"
                        onClick={() => setIsEditDialogOpen(true)}
                        title="Edit Admission ID"
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium w-24">Department:</span>
                <span className="text-muted-foreground">{user.departmentName || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium w-24">Program:</span>
                <span className="text-muted-foreground">{user.programName || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium w-24">Batch:</span>
                <span className="text-muted-foreground">{user.batchName || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">System Information</h4>
            <div className="grid gap-3 rounded-lg border bg-muted/50 p-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created At</span>
                <span className="font-medium">{format(new Date(user.createdAt), 'MMM d, yyyy HH:mm')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Updated At</span>
                <span className="font-medium">{format(new Date(user.updatedAt), 'MMM d, yyyy HH:mm')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Login</span>
                <span className="font-medium">
                  {user.lastLoginAt ? format(new Date(user.lastLoginAt), 'MMM d, yyyy HH:mm') : 'Never'}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t mt-1">
                <span className="text-muted-foreground">Created By</span>
                <span className="font-medium">{user.createdBy || 'System'}</span>
              </div>
            </div>
          </div>
          
          {isAdmin && (
            <div className="space-y-4 pt-4 border-t">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Administrative Actions</h4>
              <Button
                variant="outline"
                className="w-full text-destructive hover:bg-destructive/10"
                onClick={handleResetPassword}
                disabled={isResetting}
              >
                {isResetting ? 'Resetting...' : 'Reset Password to Default'}
              </Button>
            </div>
          )}
        </div>
      </SheetContent>

      {isAdmin && user.role === 'STUDENT' && (
        <EditAdmissionIdDialog
          user={user}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
        />
      )}
    </Sheet>
  );
}
