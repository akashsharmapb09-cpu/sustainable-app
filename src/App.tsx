import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const LandingPage = lazy(() => import('./features/public/LandingPage').then(m => ({ default: m.LandingPage })));
const OnboardingPage = lazy(() => import('./features/onboarding/OnboardingPage').then(m => ({ default: m.OnboardingPage })));
const DashboardPage = lazy(() => import('./features/dashboard/DashboardPage').then(m => ({ default: m.DashboardPage })));
const ProfilePage = lazy(() => import('./features/profile/ProfilePage').then(m => ({ default: m.ProfilePage })));
const ProPage = lazy(() => import('./features/pro/ProPage').then(m => ({ default: m.ProPage })));
const TermsPage = lazy(() => import('./features/legal/TermsPage').then(m => ({ default: m.TermsPage })));
const PrivacyPage = lazy(() => import('./features/legal/PrivacyPage').then(m => ({ default: m.PrivacyPage })));

function RouteMotion({ children }: { children: React.ReactNode }) {
  return <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -3 }} transition={{ duration: 0.4, ease: 'easeOut' }}>{children}</motion.div>;
}

function App() {
  const location = useLocation();
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F7F5F0] p-8"><div className="skeleton-shimmer h-8 w-48" /><div className="skeleton-shimmer mt-6 h-40 max-w-2xl" /></div>}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<RouteMotion><LandingPage /></RouteMotion>} />
          <Route path="/onboarding" element={<RouteMotion><OnboardingPage /></RouteMotion>} />
          <Route path="/dashboard" element={<RouteMotion><DashboardPage /></RouteMotion>} />
          <Route path="/profile" element={<RouteMotion><ProfilePage /></RouteMotion>} />
          <Route path="/pro" element={<RouteMotion><ProPage /></RouteMotion>} />
          <Route path="/terms" element={<RouteMotion><TermsPage /></RouteMotion>} />
          <Route path="/privacy" element={<RouteMotion><PrivacyPage /></RouteMotion>} />
          <Route path="/explore" element={<Navigate to="/dashboard#topics" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}
export default App;
