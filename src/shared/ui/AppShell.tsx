import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  LayoutDashboard, PenLine, Lightbulb, Compass,
  TrendingUp, Settings, LogOut, Menu, X, Moon, Sun,
} from 'lucide-react';
import { useAuth } from '../../features/auth/context/authContextDef';
import { cn } from '../lib/utils';

const NAV_ITEMS = [
  { to: '/dashboard',       icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/log',             icon: PenLine,          label: 'Log activity' },
  { to: '/recommendations', icon: Lightbulb,        label: 'Recommendations' },
  { to: '/explore',         icon: Compass,          label: 'Explore' },
  { to: '/progress',        icon: TrendingUp,       label: 'Progress' },
  { to: '/settings',        icon: Settings,         label: 'Settings' },
] as const;

export function AppShell() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dark, setDark] = useState(
    () => document.documentElement.classList.contains('dark')
  );

  const handleLogout = async () => {
    if (user?.id === 'demo-user') {
      navigate('/');
      return;
    }
    await logout();
    navigate('/');
  };

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-ink/30 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-border bg-surface transition-transform duration-200 md:static md:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        aria-label="Main navigation"
      >
        {/* Masthead */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <NavLink to="/dashboard" className="flex items-center gap-2" onClick={() => setSidebarOpen(false)}>
            <span className="font-serif text-xl font-bold tracking-tight text-foreground">
              GreenSwap<span className="text-burnt">.</span>
            </span>
          </NavLink>
          <button
            className="md:hidden text-ink-muted hover:text-foreground"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User identity */}
        <div className="border-b border-border px-5 py-3">
          <p className="taxonomy-label mb-0.5">FIELD OPERATOR</p>
          <p className="text-sm font-sans truncate text-foreground">{user?.email}</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5" aria-label="App navigation">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded px-3 py-2.5 text-sm font-sans transition-colors',
                  isActive
                    ? 'bg-moss/10 text-moss font-medium border-l-2 border-moss pl-[10px]'
                    : 'text-ink-muted hover:bg-surface-muted hover:text-foreground'
                )
              }
            >
              <Icon className="h-4 w-4 flex-shrink-0" strokeWidth={1.5} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom controls */}
        <div className="border-t border-border px-3 py-4 space-y-1">
          <button
            onClick={toggleTheme}
            className="flex w-full items-center gap-3 rounded px-3 py-2.5 text-sm text-ink-muted hover:bg-surface-muted hover:text-foreground transition-colors"
            aria-label="Toggle theme"
          >
            {dark ? <Sun className="h-4 w-4 flex-shrink-0" strokeWidth={1.5} /> : <Moon className="h-4 w-4 flex-shrink-0" strokeWidth={1.5} />}
            {dark ? 'Light mode' : 'Dark mode'}
          </button>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded px-3 py-2.5 text-sm text-ink-muted hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
          >
            <LogOut className="h-4 w-4 flex-shrink-0" strokeWidth={1.5} />
            {user?.id === 'demo-user' ? 'Return to home' : 'Sign out'}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="flex items-center justify-between border-b border-border bg-surface px-4 py-3 md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-ink-muted hover:text-foreground"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-serif text-lg font-bold tracking-tight">
            GreenSwap<span className="text-burnt">.</span>
          </span>
          <div className="w-5" />
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
