import { Outlet } from 'react-router-dom';
import { useAuth } from '../../features/auth/context/authContextDef';
import { AppShell } from './AppShell';

export function MaybeShell() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <Outlet />;
  if (isAuthenticated) return <AppShell />;
  return <Outlet />;
}
