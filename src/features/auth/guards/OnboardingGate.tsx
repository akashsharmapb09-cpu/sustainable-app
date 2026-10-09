import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/authContextDef';
import { useProfile } from '../../../shared/lib/hooks/useData';

export function OnboardingGate() {
  const { profile: authProfile } = useAuth();
  const { data: queryProfile, isLoading } = useProfile();
  const location = useLocation();
  const profile = queryProfile ?? authProfile;
  const onOnboarding = location.pathname === '/onboarding';

  if (isLoading && !profile) {
    return <Outlet />;
  }

  if (!profile?.onboarding_completed && !onOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  if (profile?.onboarding_completed && onOnboarding) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
