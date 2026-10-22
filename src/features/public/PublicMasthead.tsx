import { Link, useLocation } from 'react-router-dom';
import { Button } from '../../shared/ui';

export const publicNavLinkClass =
  "relative font-medium text-ink-muted transition-colors duration-200 " +
  "after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full " +
  "after:origin-left after:scale-x-0 after:bg-[#33593A] after:transition-transform " +
  "after:duration-300 after:content-[''] hover:text-foreground hover:after:scale-x-100 " +
  "focus-visible:after:scale-x-100";

export function PublicMasthead() {
  const { pathname } = useLocation();
  const links = [
    ['/explore', 'Explore'],
    ['/catalogue', 'Catalogue'],
    ['/methodology', 'Methodology'],
    ['/data-sources', 'Data Sources'],
    ['/about', 'About'],
    ['/contact', 'Contact'],
  ] as const;

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(245,240,232,0.9)',
      borderBottom: '1px solid #DFD7CA',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      transition: 'background 0.3s',
    }}>
      <div style={{
        maxWidth: 1240,
        margin: '0 auto',
        padding: '0 2rem',
        height: 68,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '2rem',
      }}>
        <Link to="/" style={{
          fontFamily: "'Fraunces',Georgia,serif",
          fontSize: '1.4rem',
          fontWeight: 700,
          color: '#1B211E',
          textDecoration: 'none',
          transition: 'opacity 0.2s',
        }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          GreenSwap<span style={{ color: '#1B211E' }}>.</span>
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
          {links.map(([href, label]) => (
            <Link
              key={label}
              to={href}
              className={publicNavLinkClass}
              style={{
                fontSize: '0.82rem',
                textDecoration: 'none',
                color: pathname === href ? '#1B211E' : '#535C55',
                fontWeight: pathname === href ? 600 : 500,
              }}
            >
              {label}
            </Link>
          ))}
        </nav>

        <Link to="/onboarding">
          <Button
            variant="primary"
            size="sm"
            style={{
              borderRadius: 999,
              background: '#1B2B1F',
              color: '#F5F0E8',
              border: 'none',
              padding: '0.5rem 1.2rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              transition: 'background 0.2s, transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 24px rgba(27,43,31,0.28)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = '';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '';
            }}
          >
            Get Started
          </Button>
        </Link>
      </div>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer style={{
      background: '#F0EAE1',
      borderTop: '1px solid #DFD7CA',
      padding: '2.5rem 2rem 1.5rem',
    }}>
      <div style={{
        maxWidth: 1240,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '2rem',
        flexWrap: 'wrap',
        paddingBottom: '1.5rem',
        borderBottom: '1px solid #DFD7CA',
      }}>
        <Link to="/" style={{
          fontFamily: "'Fraunces',Georgia,serif",
          fontSize: '1.4rem',
          fontWeight: 700,
          color: '#1B211E',
          textDecoration: 'none',
        }}>
          GreenSwap.
        </Link>
        <nav style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem' }}>
          {[['/', 'Home'],['/explore','Explore'],['/catalogue','Catalogue'],['/methodology','Methodology'],['/data-sources','Data Sources'],['/about','About'],['/contact','Contact'],['/privacy','Privacy'],['/terms','Terms']].map(([href, label]) => (
            <Link
              key={label}
              to={href}
              style={{
                fontSize: '0.78rem',
                color: '#535C55',
                textDecoration: 'none',
                transition: 'color 0.2s',
                position: 'relative',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#1B211E')}
              onMouseLeave={e => (e.currentTarget.style.color = '#535C55')}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
      <div style={{
        maxWidth: 1240,
        margin: '1rem auto 0',
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem',
        fontSize: '0.68rem',
        color: '#848E86',
      }}>
        <span>GreenSwap 2026 — Built to inspire, not to preach.</span>
        <span>
          Project made by <strong style={{ color: '#535C55' }}>Akash Sharma</strong> ·{' '}
          <strong style={{ color: '#535C55' }}>Ridhima Sambyal</strong> ·{' '}
          <strong style={{ color: '#535C55' }}>Suhani</strong>
        </span>
      </div>
    </footer>
  );
}
