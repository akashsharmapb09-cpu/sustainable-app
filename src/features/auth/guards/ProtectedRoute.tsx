import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/authContextDef';

export function ProtectedRoute() {
  const { isAuthenticated, isLoading, enterDemoSession } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-2 text-xs font-mono text-ink-muted">
          <Loader2 className="h-4 w-4 animate-spin text-burnt" />
          <span>VERIFYING SESSION…</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <DemoSessionRedirect enterDemoSession={enterDemoSession} />;
  }

  return <Outlet />;
}

function DemoSessionRedirect({ enterDemoSession }: { enterDemoSession: () => void }) {
  useEffect(() => {
    enterDemoSession();
  }, [enterDemoSession]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex items-center gap-2 text-xs font-mono text-ink-muted">
        <Loader2 className="h-4 w-4 animate-spin text-burnt" />
        <span>OPENING FIELD DEMO…</span>
      </div>
    </div>
  );
}
