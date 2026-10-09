import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { ProtectedRoute } from './features/auth/guards/ProtectedRoute';
import { AdminRoute } from './features/auth/guards/AdminRoute';
import { OnboardingGate } from './features/auth/guards/OnboardingGate';
import { AppShell } from './shared/ui/AppShell';
import { MaybeShell } from './shared/ui/MaybeShell';
import { CardSkeleton } from './shared/ui/Skeleton';
import { LandingPage } from './features/public/LandingPage';

const MethodologyPage = lazy(() => import('./features/public/MethodologyPage').then((m) => ({ default: m.MethodologyPage })));
const StyleGuidePage = lazy(() => import('./features/styleguide/StyleGuidePage').then((m) => ({ default: m.StyleGuidePage })));
const AboutPage = lazy(() => import('./features/public/AboutPage').then((m) => ({ default: m.AboutPage })));
const PrivacyPage = lazy(() => import('./features/public/LegalPages').then((m) => ({ default: m.PrivacyPage })));
const TermsPage = lazy(() => import('./features/public/LegalPages').then((m) => ({ default: m.TermsPage })));
const CookiesPage = lazy(() => import('./features/public/LegalPages').then((m) => ({ default: m.CookiesPage })));
const NotFoundPage = lazy(() => import('./features/public/LegalPages').then((m) => ({ default: m.NotFoundPage })));
const ExplorePage = lazy(() => import('./features/explore/ExplorePage').then((m) => ({ default: m.ExplorePage })));
const OnboardingPage = lazy(() => import('./features/onboarding/OnboardingPage').then((m) => ({ default: m.OnboardingPage })));
const DashboardPage = lazy(() => import('./features/dashboard/DashboardPage').then((m) => ({ default: m.DashboardPage })));
const LogActivityPage = lazy(() => import('./features/activities/LogActivityPage').then((m) => ({ default: m.LogActivityPage })));
const RecommendationsPage = lazy(() => import('./features/recommendations/RecommendationsPage').then((m) => ({ default: m.RecommendationsPage })));
const ProgressPage = lazy(() => import('./features/progress/ProgressPage').then((m) => ({ default: m.ProgressPage })));
const SettingsPage = lazy(() => import('./features/settings/SettingsPage').then((m) => ({ default: m.SettingsPage })));
const AdminPage = lazy(() => import('./features/admin/AdminPage').then((m) => ({ default: m.AdminPage })));

function PageLoader() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12 md:px-12 space-y-6">
      <CardSkeleton />
      <CardSkeleton />
    </div>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <Suspense fallback={<PageLoader />}>
      <div className="route-enter" key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/methodology" element={<MethodologyPage />} />
          <Route path="/styleguide" element={<StyleGuidePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/cookies" element={<CookiesPage />} />

          <Route element={<MaybeShell />}>
            <Route path="/explore" element={<ExplorePage />} />
          </Route>

         <Route path="/login" element={<LandingPage />} />
         <Route path="/signup" element={<OnboardingPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<OnboardingGate />}>
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route element={<AppShell />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/log" element={<LogActivityPage />} />
                <Route path="/recommendations" element={<RecommendationsPage />} />
                <Route path="/progress" element={<ProgressPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
            </Route>
          </Route>

          <Route path="/auth/verify-email" element={<Navigate to="/dashboard" replace />} />
          <Route path="/auth/reset-password" element={<Navigate to="/dashboard" replace />} />

          <Route element={<AdminRoute />}>
            <Route element={<AppShell />}>
              <Route path="/admin" element={<AdminPage />} />
            </Route>
          </Route>

          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </div>
    </Suspense>
  );
}
