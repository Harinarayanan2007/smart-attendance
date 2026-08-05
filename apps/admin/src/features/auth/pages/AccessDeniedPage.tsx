import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function AccessDeniedPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
      <div className="flex max-w-md flex-col items-center space-y-6 rounded-2xl border bg-card p-8 shadow-sm">
        <div className="rounded-full bg-destructive/10 p-4">
          <ShieldAlert className="h-12 w-12 text-destructive" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Access Denied</h1>
          <p className="text-muted-foreground">
            This portal is restricted to administrators. Please use the Attendance Mobile Application if you are a student or faculty member.
          </p>
        </div>

        <Button onClick={() => navigate('/login')} variant="default" className="w-full">
          Return to Login
        </Button>
      </div>
    </div>
  );
}
