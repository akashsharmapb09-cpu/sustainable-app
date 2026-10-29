import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
  LayoutDashboard,
  Compass,
  BookOpen,
  RotateCcw,
  Heart,
  BarChart3,
  Settings,
  Search,
  Bell,
  Menu,
  X,
  LogOut,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuth } from '../../features/auth/context/authContextDef';

const SIDEBAR_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/explore', label: 'Discover', icon: Compass },
  { to: '/catalogue', label: 'Catalogue', icon: BookOpen },
  { to: '/routine', label: 'Your Routine', icon: RotateCcw },
  { to: '/recommendations', label: 'Saved Ideas', icon: Heart },
  { to: '/progress', label: 'Impact', icon: BarChart3 },
] as const;

export function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  );

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
  };

  const handleSignOut = async () => {
    if (user?.id === 'demo-user') {
      navigate('/');
      return;
    }
    await logout();
    navigate('/');
  };

  return (
    <div className="shell-root">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="shell-overlay md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Left Sidebar (Dark Spruce Green matching image) ── */}
      <aside className={`shell-sidebar ${sidebarOpen ? 'is-open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-brand-box">
          <NavLink to="/" className="sidebar-logo">
            GreenSwap<span className="dot">.</span>
          </NavLink>
          <button
            type="button"
            className="sidebar-close-btn md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Small Search Icon under Logo */}
        <div className="sidebar-search-trigger">
          <Search className="h-4 w-4 text-emerald-300/70" />
        </div>

        {/* Navigation list */}
        <nav className="sidebar-nav">
          {SIDEBAR_ITEMS.map(({ to, label, icon: Icon }) => {
            const isActive =
              to === '/dashboard'
                ? location.pathname === '/dashboard'
                : location.pathname.startsWith(to);

            return (
              <NavLink
                key={to}
                to={to}
                onClick={() => setSidebarOpen(false)}
                className={`sidebar-nav-item ${isActive ? 'is-active' : ''}`}
              >
                <Icon className="nav-icon" strokeWidth={1.8} />
                <span className="nav-label">{label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Navigation */}
        <div className="sidebar-footer">
          <NavLink
            to="/settings"
            onClick={() => setSidebarOpen(false)}
            className={`sidebar-nav-item ${location.pathname === '/settings' ? 'is-active' : ''}`}
          >
            <Settings className="nav-icon" strokeWidth={1.8} />
            <span className="nav-label">Settings</span>
          </NavLink>

          <button
            type="button"
            className="sidebar-nav-item sidebar-btn"
            onClick={handleSignOut}
          >
            <LogOut className="nav-icon" strokeWidth={1.8} />
            <span className="nav-label">Log out</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <div className="shell-main">
        {/* Top Header Bar */}
        <header className="shell-topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="topbar-menu-btn md:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Pill Search with ⌘ K */}
            <div className="topbar-search">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search swaps, tips..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                aria-label="Search swaps and tips"
              />
              <span className="search-shortcut">⌘ K</span>
            </div>
          </div>

          <div className="topbar-right">
            {/* Bell Notification */}
            <button type="button" className="topbar-action-btn" aria-label="Notifications">
              <Bell className="h-4 w-4" />
            </button>

            {/* Theme Toggle */}
            <button
              type="button"
              className="topbar-action-btn"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* User Avatar Circle with letter 'A' */}
            <NavLink
              to="/settings"
              className="topbar-avatar"
              title={`${(typeof window !== 'undefined' ? localStorage.getItem('userName') : null) || (user?.user_metadata?.full_name && !user.user_metadata.full_name.includes('Field') ? user.user_metadata.full_name : null) || 'User'} (Settings)`}
            >
              <span>{((typeof window !== 'undefined' ? localStorage.getItem('userName') : null) || (user?.user_metadata?.full_name && !user.user_metadata.full_name.includes('Field') ? user.user_metadata.full_name : null) || 'U')[0].toUpperCase()}</span>
            </NavLink>
          </div>
        </header>

        {/* Main Body */}
        <main className="shell-body">
          <Outlet />
        </main>
      </div>

      <style>{`
        .shell-root {
          display: flex;
          min-height: 100vh;
          background-color: var(--color-bg);
          color: var(--color-ink);
          font-family: 'DM Sans', sans-serif;
        }

        /* ── Sidebar (Dark Forest Spruce matching image) ── */
        .shell-sidebar {
          width: 220px;
          background-color: #162a20;
          color: #d2ded7;
          display: flex;
          flex-direction: column;
          position: fixed;
          inset-y: 0;
          left: 0;
          z-index: 40;
          transition: transform 0.25s ease;
        }
        @media (min-width: 768px) {
          .shell-sidebar {
            position: sticky;
            top: 0;
            height: 100vh;
            transform: none !important;
          }
        }
        @media (max-width: 767px) {
          .shell-sidebar {
            transform: translateX(-100%);
            box-shadow: 0 0 40px rgba(0, 0, 0, 0.4);
          }
          .shell-sidebar.is-open {
            transform: translateX(0);
          }
        }

        .sidebar-brand-box {
          padding: 1.5rem 1.4rem 0.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .sidebar-logo {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: #ffffff;
          text-decoration: none;
        }
        .sidebar-logo .dot { color: #52c286; }
        .sidebar-close-btn {
          background: none;
          border: none;
          color: #a8dfbc;
          cursor: pointer;
        }
        .sidebar-search-trigger {
          padding: 0.5rem 1.4rem 0.8rem;
        }

        .sidebar-nav {
          padding: 0.5rem 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          flex: 1;
          overflow-y: auto;
        }

        .sidebar-nav-item {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          padding: 0.6rem 0.95rem;
          border-radius: 999px;
          text-decoration: none;
          color: #b5c7bd;
          font-size: 0.82rem;
          font-weight: 500;
          transition: all 0.15s ease;
        }
        .sidebar-nav-item:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.08);
        }

        /* Active Pill: White pill with dark text matching image */
        .sidebar-nav-item.is-active {
          background: #ffffff;
          color: #162a20 !important;
          font-weight: 700;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.18);
        }
        .sidebar-nav-item.is-active .nav-icon {
          color: #162a20;
        }

        .nav-icon {
          width: 17px;
          height: 17px;
          flex-shrink: 0;
        }

        .sidebar-btn {
          background: none;
          border: none;
          cursor: pointer;
          width: 100%;
          text-align: left;
        }

        .sidebar-footer {
          padding: 0.8rem 0.85rem 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        /* ── Main Layout ── */
        .shell-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          background-color: var(--color-bg);
        }

        /* ── Top Bar ── */
        .shell-topbar {
          height: 64px;
          padding: 0 2.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--color-border);
          background-color: var(--color-bg);
          position: sticky;
          top: 0;
          z-index: 20;
        }
        @media (max-width: 768px) {
          .shell-topbar { padding: 0 1.25rem; }
        }

        .topbar-left {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex: 1;
          max-width: 460px;
        }
        .topbar-menu-btn {
          background: none;
          border: none;
          color: var(--color-ink);
          cursor: pointer;
        }

        /* Pill Search */
        .topbar-search {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          background: #FAF8F4;
          border: 1px solid #DFD7CA;
          border-radius: 999px;
          padding: 0.45rem 1.1rem;
          width: 100%;
          max-width: 360px;
          transition: all 0.2s;
        }
        .dark .topbar-search {
          background: #18221c;
          border-color: #26382e;
        }
        .topbar-search:focus-within {
          background: #ffffff;
          border-color: #162a20;
          box-shadow: 0 0 0 3px rgba(22, 42, 32, 0.12);
        }
        .search-icon {
          width: 14px;
          height: 14px;
          color: var(--color-ink-muted);
          flex-shrink: 0;
        }
        .topbar-search input {
          border: none;
          background: none;
          outline: none;
          font-size: 0.78rem;
          color: var(--color-ink);
          width: 100%;
        }
        .search-shortcut {
          font-size: 0.68rem;
          font-family: monospace;
          background: rgba(0, 0, 0, 0.06);
          padding: 0.15rem 0.4rem;
          border-radius: 4px;
          color: var(--color-ink-muted);
        }
        .dark .search-shortcut {
          background: rgba(255, 255, 255, 0.1);
        }

        /* Right Actions */
        .topbar-right {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }
        .topbar-action-btn {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: 1px solid #DFD7CA;
          background: #FAF8F4;
          color: var(--color-ink-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s;
        }
        .dark .topbar-action-btn {
          background: #18221c;
          border-color: #26382e;
        }
        .topbar-action-btn:hover {
          color: var(--color-ink);
          border-color: #162a20;
        }

        /* User Avatar: Circle with 'A' */
        .topbar-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #d6e8dc;
          color: #162a20;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.82rem;
          font-weight: 700;
          text-decoration: none;
          transition: transform 0.15s;
        }
        .topbar-avatar:hover {
          transform: scale(1.05);
        }

        .shell-body {
          flex: 1;
          overflow-y: auto;
        }

        .shell-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 35;
          backdrop-filter: blur(4px);
        }
      `}</style>
    </div>
  );
}
