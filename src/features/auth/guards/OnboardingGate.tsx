import { Outlet } from 'react-router-dom';

export function OnboardingGate() {
  // Do not block /dashboard with onboarding guard
  return <Outlet />;
}
