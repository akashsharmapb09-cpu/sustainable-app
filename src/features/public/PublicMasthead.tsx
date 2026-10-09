import { Link } from 'react-router-dom';
import { Button } from '../../shared/ui';

export const publicNavLinkClass =
  "relative font-medium text-ink-muted transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-200 after:content-[''] hover:text-foreground hover:after:scale-x-100 focus-visible:after:scale-x-100";

export function PublicMasthead() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-[#fbf8f1]/90 px-5 py-4 backdrop-blur sm:px-8 md:px-12">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
        <Link to="/" className="font-serif text-2xl font-bold tracking-tight text-foreground">
          GreenSwap<span className="text-burnt">.</span>
        </Link>
        <nav className="hidden items-center gap-6 text-xs font-mono md:flex">
          <Link to="/explore" className={publicNavLinkClass}>Explore Catalog</Link>
          <Link to="/methodology" className={publicNavLinkClass}>Methodology &amp; Citations</Link>
          <Link to="/about" className={publicNavLinkClass}>About</Link>
          <Link to="/styleguide" className={publicNavLinkClass}>Styleguide</Link>
        </nav>
        <Link to="/onboarding" className="shrink-0">
          <Button variant="primary" size="sm" className="rounded-full border-black bg-black px-5 py-2 text-white shadow-none ring-1 ring-white/30 ring-offset-2 ring-offset-black transition hover:scale-105 hover:bg-black/90 dark:bg-black dark:text-white dark:hover:bg-black/90">
            Begin Calibration
          </Button>
        </Link>
      </div>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-surface px-5 py-7 text-xs font-mono sm:px-8 md:px-12">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-5 md:flex-row md:items-center">
        <p className="text-[10px] tracking-wide text-ink-muted">© 2026 GreenSwap • Data: DEFRA • No cookies</p>
        <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-5 gap-y-3 text-ink-muted">
          <Link to="/launch" className="hover:text-foreground">Launch kit</Link>
          <Link to="/methodology" className="hover:text-foreground">Methodology</Link>
          <Link to="/explore" className="hover:text-foreground">Catalog</Link>
          <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
          <Link to="/terms" className="hover:text-foreground">Terms</Link>
          <Link to="/cookies" className="hover:text-foreground">Cookies</Link>
          <Link to="/about" className="hover:text-foreground">About</Link>
          <Link to="/faq" className="hover:text-foreground">FAQ</Link>
        </nav>
      </div>
    </footer>
  );
}
