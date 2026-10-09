import { Link } from 'react-router-dom';
import { Button } from '../../shared/ui';

export const publicNavLinkClass =
  "relative font-medium text-ink-muted transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-200 after:content-[''] hover:text-foreground hover:after:scale-x-100 focus-visible:after:scale-x-100";

export function PublicMasthead() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-[#fbf8f1]/90 px-6 py-4 backdrop-blur md:px-12">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link to="/" className="font-serif text-2xl font-bold tracking-tight text-foreground">
          GreenSwap<span className="text-burnt">.</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-xs font-mono">
          <Link to="/explore" className={publicNavLinkClass}>Explore Catalog</Link>
          <Link to="/methodology" className={publicNavLinkClass}>Methodology &amp; Citations</Link>
          <Link to="/about" className={publicNavLinkClass}>About</Link>
          <Link to="/styleguide" className={publicNavLinkClass}>Styleguide</Link>
        </nav>
        <Link to="/onboarding">
          <Button
            variant="primary"
            size="sm"
            className="rounded-full border-black bg-black px-5 py-2 text-white shadow-none ring-1 ring-white/30 ring-offset-2 ring-offset-black transition hover:scale-105 hover:bg-black/90 dark:bg-black dark:text-white dark:hover:bg-black/90"
          >
            Begin Calibration
          </Button>
        </Link>
      </div>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-surface px-6 py-12 md:px-12 text-xs font-mono">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <span className="font-serif text-lg font-bold text-foreground">GreenSwap.</span>
        <div className="flex flex-wrap gap-6 text-ink-muted">
          <Link to="/methodology" className="hover:text-foreground">Methodology</Link>
          <Link to="/explore" className="hover:text-foreground">Catalog</Link>
          <Link to="/privacy" className="hover:text-foreground">Privacy (DPDP)</Link>
          <Link to="/terms" className="hover:text-foreground">Terms</Link>
          <Link to="/cookies" className="hover:text-foreground">Cookies</Link>
          <Link to="/about" className="hover:text-foreground">About</Link>
        </div>
      </div>
    </footer>
  );
}
