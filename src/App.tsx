import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense } from 'react';
import LandingPage from './features/public/LandingPage';
import OnboardingPage from './features/onboarding/OnboardingPage';
import DashboardPage from './features/dashboard/DashboardPage';

function App() {
  return (
    <Suspense fallback={<div style={{ padding: '20px' }}>Loading...</div>}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
