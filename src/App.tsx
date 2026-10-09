import { Routes, Route, useLocation } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const LandingPage = lazy(() => import('./features/public/LandingPage').then(m => ({ default: m.LandingPage })));
const LaunchPage = lazy(() => import('./features/public/LaunchPage').then(m => ({ default: m.LaunchPage })));
const AboutPage = lazy(() => import('./features/public/AboutPage').then(m => ({ default: m.AboutPage })));
const MethodologyPage = lazy(() => import('./features/public/MethodologyPage').then(m => ({ default: m.MethodologyPage })));
const ExplorePage = lazy(() => import('./features/explore/ExplorePage').then(m => ({ default: m.ExplorePage })));
const StyleGuidePage = lazy(() => import('./features/styleguide/StyleGuidePage').then(m => ({ default: m.StyleGuidePage })));
const OnboardingPage = lazy(() => import('./features/onboarding/OnboardingPage').then(m => ({ default: m.OnboardingPage })));
const DashboardPage = lazy(() => import('./features/dashboard/DashboardPage').then(m => ({ default: m.DashboardPage })));
const ProfilePage = lazy(() => import('./features/profile/ProfilePage').then(m => ({ default: m.ProfilePage })));
const ProPage = lazy(() => import('./features/pro/ProPage').then(m => ({ default: m.ProPage })));
const RecommendationsPage = lazy(() => import('./features/recommendations/RecommendationsPage').then(m => ({ default: m.RecommendationsPage })));
const LogActivityPage = lazy(() => import('./features/activities/LogActivityPage').then(m => ({ default: m.LogActivityPage })));
const ProgressPage = lazy(() => import('./features/progress/ProgressPage').then(m => ({ default: m.ProgressPage })));
const SettingsPage = lazy(() => import('./features/settings/SettingsPage').then(m => ({ default: m.SettingsPage })));
const LoginPage = lazy(() => import('./features/auth/pages/LoginPage').then(m => ({ default: m.LoginPage })));
const ResetPasswordPage = lazy(() => import('./features/auth/pages/ResetPasswordPage').then(m => ({ default: m.ResetPasswordPage })));
const AuthVerificationPage = lazy(() => import('./features/auth/pages/AuthVerificationPage').then(m => ({ default: m.AuthVerificationPage })));
const TermsPage = lazy(() => import('./features/legal/TermsPage').then(m => ({ default: m.TermsPage })));
const PrivacyPage = lazy(() => import('./features/legal/PrivacyPage').then(m => ({ default: m.PrivacyPage })));
const CookiesPage = lazy(() => import('./features/public/LegalPages').then(m => ({ default: m.CookiesPage })));
const NotFoundPage = lazy(() => import('./features/public/LegalPages').then(m => ({ default: m.NotFoundPage })));

function LoadingScreen() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#F7F5F0] px-6 py-12 text-[#0E0E0E]" role="status" aria-live="polite" aria-busy="true">
      <div className="font-serif text-3xl tracking-tight">GreenSwap<span className="text-[#b64b2c]">.</span></div>
      <div className="mt-8 h-9 w-9 animate-spin rounded-full border border-black/15 border-t-[#315b3d]" aria-hidden="true" />
      <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-black/50">A lighter routine starts here</p>
      <h1 className="mt-3 max-w-lg text-center font-serif text-3xl leading-tight sm:text-4xl">Preparing your next useful swap.</h1>
      <p className="mt-3 max-w-sm text-center text-sm leading-6 text-black/60">Opening practical ideas for food, travel, energy and reuse. You can explore without entering personal data.</p>
    </main>
  );
}

function RouteMotion({ children }: { children: React.ReactNode }) {
  return <motion.div className="min-w-0" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -3 }} transition={{ duration: 0.4, ease: 'easeOut' }}>{children}</motion.div>;
}

function App() {
  const location = useLocation();
  return (
    <Suspense fallback={<LoadingScreen />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<RouteMotion><LandingPage /></RouteMotion>} />
          <Route path="/launch" element={<RouteMotion><LaunchPage /></RouteMotion>} />
          <Route path="/about" element={<RouteMotion><AboutPage /></RouteMotion>} />
          <Route path="/methodology" element={<RouteMotion><MethodologyPage /></RouteMotion>} />
          <Route path="/explore" element={<RouteMotion><ExplorePage /></RouteMotion>} />
          <Route path="/styleguide" element={<RouteMotion><StyleGuidePage /></RouteMotion>} />
          <Route path="/onboarding" element={<RouteMotion><OnboardingPage /></RouteMotion>} />
          <Route path="/dashboard" element={<RouteMotion><DashboardPage /></RouteMotion>} />
          <Route path="/profile" element={<RouteMotion><ProfilePage /></RouteMotion>} />
          <Route path="/pro" element={<RouteMotion><ProPage /></RouteMotion>} />
          <Route path="/recommendations" element={<RouteMotion><RecommendationsPage /></RouteMotion>} />
          <Route path="/log" element={<RouteMotion><LogActivityPage /></RouteMotion>} />
          <Route path="/progress" element={<RouteMotion><ProgressPage /></RouteMotion>} />
          <Route path="/settings" element={<RouteMotion><SettingsPage /></RouteMotion>} />
          <Route path="/login" element={<RouteMotion><LoginPage /></RouteMotion>} />
          <Route path="/reset-password" element={<RouteMotion><ResetPasswordPage /></RouteMotion>} />
          <Route path="/verify" element={<RouteMotion><AuthVerificationPage /></RouteMotion>} />
          <Route path="/terms" element={<RouteMotion><TermsPage /></RouteMotion>} />
          <Route path="/privacy" element={<RouteMotion><PrivacyPage /></RouteMotion>} />
          <Route path="/cookies" element={<RouteMotion><CookiesPage /></RouteMotion>} />
          <Route path="*" element={<RouteMotion><NotFoundPage /></RouteMotion>} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}
export default App;
