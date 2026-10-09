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

function LoadingScreen() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center bg-[#F7F5F0] px-6 py-12 text-[#0E0E0E]"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="font-serif text-3xl tracking-tight">
        GreenSwap<span className="text-[#b64b2c]">.</span>
      </div>
      <div
        className="mt-8 h-9 w-9 animate-spin rounded-full border border-black/15 border-t-[#315b3d]"
        aria-hidden="true"
      />
      <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-black/50">
        A lighter routine starts here
      </p>
      <h1 className="mt-3 max-w-lg text-center font-serif text-3xl leading-tight sm:text-4xl">
        Preparing your next useful swap.
      </h1>
      <p className="mt-3 max-w-sm text-center text-sm leading-6 text-black/60">
        Opening practical ideas for food, travel, energy and reuse. You can explore without entering personal data.
      </p>
    </main>
  );
}

function RouteMotion({ children }: { children: React.ReactNode }) {
  return <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -3 }} transition={{ duration: 0.4, ease: 'easeOut' }}>{children}</motion.div>;
}

function App() {
  const location = useLocation();
  return (
    <Suspense fallback={<LoadingScreen />}>
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
