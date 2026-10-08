import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { ProtectedRoute } from './features/auth/guards/ProtectedRoute';
import { PublicOnlyRoute } from './features/auth/guards/PublicOnlyRoute';
import { AdminRoute } from './features/auth/guards/AdminRoute';
import { AppShell } from './shared/ui/AppShell';
import { CardSkeleton } from './shared/ui/Skeleton';

// Eagerly loaded (fast paths)
import { LandingPage } from './features/public/LandingPage';

function UnavailablePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:px-12">
      <p className="taxonomy-label mb-3">SECTION NOT INCLUDED</p>
      <h1 className="text-3xl font-semibold">This section is not part of this build.</h1>
      <p className="mt-4 text-ink-muted">
        The project currently contains only the public pages and authentication screens.
      </p>
    </div>
  );
}

// Auth screens are present; the remaining screens are not included in this checkout.
const LoginPage = lazy(() => import('./features/auth/pages/LoginPage').then(m => ({ default: m.LoginPage })));
const SignupPage = lazy(() => import('./features/auth/pages/SignupPage').then(m => ({ default: m.SignupPage })));
const MethodologyPage = lazy(() => import('./features/public/MethodologyPage').then(m => ({ default: m.MethodologyPage })));
const StyleGuidePage = lazy(() => import('./features/styleguide/StyleGuidePage').then(m => ({ default: m.StyleGuidePage })));

function PageLoader() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12 md:px-12 space-y-6">
      <CardSkeleton />
      <CardSkeleton />
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/methodology" element={<MethodologyPage />} />
        <Route path="/styleguide" element={<StyleGuidePage />} />

        {/* Auth routes — redirect to dashboard if already logged in */}
        <Route element={<PublicOnlyRoute redirectTo="/dashboard" />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>

        {/* Protected app routes — redirect to login if unauthenticated */}
        <Route element={<ProtectedRoute redirectTo="/login" />}>
          <Route element={<AppShell />}>
            <Route path="/onboarding" element={<UnavailablePage />} />
            <Route path="/dashboard" element={<UnavailablePage />} />
            <Route path="/log" element={<UnavailablePage />} />
            <Route path="/recommendations" element={<UnavailablePage />} />
            <Route path="/explore" element={<UnavailablePage />} />
            <Route path="/progress" element={<UnavailablePage />} />
            <Route path="/settings" element={<UnavailablePage />} />
          </Route>
        </Route>

        {/* Admin routes */}
        <Route element={<AdminRoute />}>
          <Route element={<AppShell />}>
            <Route path="/admin" element={<UnavailablePage />} />
          </Route>
        </Route>

        {/* Fallbacks */}
        <Route path="/404" element={<UnavailablePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
