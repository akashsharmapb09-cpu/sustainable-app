import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, Send } from 'lucide-react';
import './LandingPage.css';

export function LandingPage() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <div className="lp-root">
      {/* ── Header / Navigation ── */}
      <header className="lp-nav">
        <div className="lp-nav__inner">
          <Link to="/" className="lp-logo">
            GreenSwap<span className="lp-logo__dot">.</span>
          </Link>
          <nav className="lp-nav__links">
            <Link to="/" className="is-active">Home</Link>
            <Link to="/explore">Explore</Link>
            <Link to="/catalogue">Catalogue</Link>
            <Link to="/methodology">How It Works</Link>
            <Link to="/progress">Impact</Link>
          </nav>
          <div className="lp-nav__actions">
            <button className="lp-btn-ghost" aria-label="Search">
              <Search className="h-4 w-4" />
            </button>
            <Link to="/dashboard" className="lp-login-link">Log in</Link>
            <Link to="/onboarding" className="lp-btn-primary">Get Started</Link>
          </div>
        </div>
      </header>

      {/* ── Hero Section (Matching Image Top-Left) ── */}
      <section className="lp-hero">
        <div className="lp-hero__left">
          {/* Green Pill Tag */}
          <div className="lp-hero__badge-pill">
            <span className="pill-dot">🌱</span>
            <span>A GREENER TOMORROW · SAME GOOD LIFE</span>
          </div>

          <h1 className="lp-hero__title">
            Make a lighter<br />footprint.<br />
            <span className="lp-hero__title-italic">Keep the good life.</span>
          </h1>

          <p className="lp-hero__desc">
            Practical swaps backed by DEFRA, CEA, EPA data.
          </p>

          <div className="lp-hero__ctas">
            <Link to="/onboarding" className="lp-btn-primary lp-btn-primary--lg">
              Get Your Plan <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/explore" className="lp-btn-secondary lp-btn-secondary--lg">
              Explore Swaps
            </Link>
          </div>

          {/* Community Avatars */}
          <div className="lp-community-row">
            <div className="lp-avatars-stack">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80" alt="Member" />
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80" alt="Member" />
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80" alt="Member" />
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80" alt="Member" />
            </div>
            <span className="lp-community-text">
              Join a growing community making everyday changes.
            </span>
          </div>
        </div>

        {/* Hero Visual: Mountain Valley Lake + Organic Leaves + Floating Cards */}
        <div className="lp-hero__right">
          <div className="lp-arch-window">
            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80"
              alt="Mountain fjord and lush valley lake"
              className="lp-arch-img"
            />

            {/* Top Floating Card */}
            <div className="lp-floating-top">
              <span className="leaf-icon">🍃</span>
              <div>
                <strong>0.7t</strong>
                <span>CO2e saved per month (avg)</span>
              </div>
            </div>

            {/* Bottom Floating Card */}
            <div className="lp-floating-bottom">
              <span className="chart-icon">📊</span>
              <div>
                <strong>Real data from</strong>
                <span>DEFRA, CEA, EPA</span>
              </div>
            </div>
          </div>

          {/* Botanical Leaves Overlays */}
          <div className="lp-leaf-overlay lp-leaf-tl" aria-hidden="true">
            <svg viewBox="0 0 100 140" fill="none">
              <path d="M50 10 C15 35 10 80 50 130 C90 80 85 35 50 10Z" fill="#3f6545" opacity="0.9" />
              <path d="M50 10 L50 130" stroke="#25422a" strokeWidth="1.5" opacity="0.6" />
            </svg>
          </div>
          <div className="lp-leaf-overlay lp-leaf-br" aria-hidden="true">
            <svg viewBox="0 0 120 160" fill="none">
              <path d="M60 10 C20 40 10 95 60 150 C110 95 100 40 60 10Z" fill="#4d7454" opacity="0.85" />
              <path d="M60 10 L60 150" stroke="#25422a" strokeWidth="1.5" opacity="0.6" />
            </svg>
          </div>
        </div>
      </section>

      {/* ── Feature Highlights Row ── */}
      <div className="lp-features-strip">
        <div className="lp-strip-item mouse-icon-wrap" aria-hidden="true">
          <svg width="20" height="28" viewBox="0 0 24 32" fill="none" stroke="currentColor" strokeWidth="1.75">
            <rect x="3" y="2" width="18" height="28" rx="9" />
            <line x1="12" y1="7" x2="12" y2="13" />
          </svg>
        </div>

        <div className="lp-strip-item">
          <div className="strip-badge-icon">📊</div>
          <div>
            <strong>Real data</strong>
            <span>from trusted sources</span>
          </div>
        </div>

        <div className="lp-strip-item">
          <div className="strip-badge-icon">🌿</div>
          <div>
            <strong>Simple swaps</strong>
            <span>for everyday life</span>
          </div>
        </div>

        <div className="lp-strip-item">
          <div className="strip-badge-icon">🌍</div>
          <div>
            <strong>A cleaner, healthier</strong>
            <span>planet for tomorrow</span>
          </div>
        </div>
      </div>

      {/* ── Footer Matching Reference Image ── */}
      <footer className="lp-footer">
        <div className="lp-footer__top">
          {/* Brand Info */}
          <div className="lp-footer__brand-col">
            <Link to="/" className="lp-logo">GreenSwap<span className="lp-logo__dot">.</span></Link>
            <p className="lp-footer__tagline">A more thoughtful way to live.</p>
          </div>

          {/* Links Columns */}
          <div className="lp-footer__links-col">
            <h4>Product</h4>
            <Link to="/">Home</Link>
            <Link to="/explore">Explore</Link>
            <Link to="/catalogue">Catalogue</Link>
            <Link to="/methodology">How It Works</Link>
          </div>

          <div className="lp-footer__links-col">
            <h4>Company</h4>
            <Link to="/about">About</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms & Conditions</Link>
            <Link to="/methodology">FAQ</Link>
          </div>

          <div className="lp-footer__links-col">
            <h4>Resources</h4>
            <Link to="/methodology">Methodology</Link>
            <Link to="/data-sources">Data Sources</Link>
            <Link to="/about">Contact</Link>
          </div>

          {/* Newsletter Box */}
          <div className="lp-footer__newsletter-col">
            <h4>Join our newsletter</h4>
            <p>Get simple tips and updates.</p>
            <form onSubmit={handleSubscribe} className="lp-newsletter-form">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" aria-label="Subscribe">
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
            {subscribed && <span className="newsletter-thankyou">Thank you for joining! 🌱</span>}
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="lp-footer__bottom">
          <div className="lp-social-links">
            <a href="#" aria-label="Twitter X">𝕏</a>
            <a href="#" aria-label="Instagram">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /></svg>
            </a>
            <a href="#" aria-label="LinkedIn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
            </a>
          </div>

          <div className="lp-footer__credits">
            <div className="credits-text">
              <span className="credits-label">PROJECT MADE BY</span>
              <strong className="credits-names">Akash Sharma · Ridhima Sambyal · Suhani</strong>
              <span className="credits-sub">Small choices. Lighter footprint.</span>
            </div>
            <div className="credits-leaf" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#33593A">
                <path d="M17 8C8 10 5 16 3 21C8 21 14 18 17 8Z" />
                <path d="M17 8C19 4 21 3 22 2C21 5 19 8 17 8Z" />
              </svg>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        /* Hero & Section adjustments matching reference image */
        .lp-hero__badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.35rem 0.85rem;
          background: rgba(18, 56, 38, 0.08);
          border: 1px solid rgba(18, 56, 38, 0.2);
          border-radius: 999px;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #123826;
          margin-bottom: 0.5rem;
        }
        .lp-hero__title-italic {
          font-style: italic;
          color: #123826;
          font-weight: 400;
        }
        .lp-community-row {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          margin-top: 1rem;
        }
        .lp-avatars-stack {
          display: flex;
          align-items: center;
        }
        .lp-avatars-stack img {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 2px solid #F5F0E8;
          margin-left: -7px;
          object-fit: cover;
        }
        .lp-avatars-stack img:first-child { margin-left: 0; }
        .lp-community-text {
          font-size: 0.75rem;
          color: #535C55;
          line-height: 1.35;
        }

        /* Arch Window with mountain lake */
        .lp-arch-window {
          position: relative;
          width: 360px;
          height: 480px;
          border-radius: 180px 180px 30px 30px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.16);
          border: 4px solid #ffffff;
        }
        .lp-arch-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .lp-floating-top {
          position: absolute;
          top: 30px;
          right: 15px;
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(8px);
          border-radius: 12px;
          padding: 0.7rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          z-index: 5;
        }
        .lp-floating-top strong {
          display: block;
          font-family: 'Fraunces', Georgia, serif;
          font-size: 1.25rem;
          font-weight: 700;
          color: #1B211E;
          line-height: 1;
        }
        .lp-floating-top span {
          font-size: 0.62rem;
          color: #535C55;
        }
        .lp-floating-bottom {
          position: absolute;
          bottom: 40px;
          right: 20px;
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(8px);
          border-radius: 12px;
          padding: 0.65rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          z-index: 5;
        }
        .lp-floating-bottom strong {
          display: block;
          font-size: 0.72rem;
          font-weight: 700;
          color: #1B211E;
        }
        .lp-floating-bottom span {
          font-size: 0.62rem;
          color: #535C55;
        }
        .lp-leaf-overlay {
          position: absolute;
          pointer-events: none;
          z-index: 4;
        }
        .lp-leaf-tl {
          top: -20px;
          left: -20px;
          width: 100px;
          transform: rotate(-25deg);
        }
        .lp-leaf-br {
          bottom: -30px;
          right: -30px;
          width: 120px;
          transform: rotate(20deg);
        }

        /* Features Strip */
        .lp-features-strip {
          max-width: 1240px;
          margin: 0 auto;
          padding: 2.5rem 2rem 3rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid #DFD7CA;
          gap: 1.5rem;
          flex-wrap: wrap;
        }
        .mouse-icon-wrap {
          color: #848E86;
        }
        .lp-strip-item {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }
        .strip-badge-icon {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(18, 56, 38, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
        }
        .lp-strip-item strong {
          display: block;
          font-size: 0.85rem;
          font-weight: 700;
          color: #1B211E;
        }
        .lp-strip-item span {
          font-size: 0.72rem;
          color: #535C55;
        }

        /* Footer */
        .lp-footer {
          background: #EDE6DC;
          border-top: 1px solid #DFD7CA;
          padding: 4rem 2rem 2rem;
        }
        .lp-footer__top {
          max-width: 1240px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1fr 1.5fr;
          gap: 2.5rem;
          padding-bottom: 3rem;
          border-bottom: 1px solid #DFD7CA;
        }
        .lp-footer__tagline {
          font-size: 0.85rem;
          color: #535C55;
          margin-top: 0.75rem;
        }
        .lp-footer__links-col h4, .lp-footer__newsletter-col h4 {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #1B211E;
          margin: 0 0 1rem;
        }
        .lp-footer__links-col a {
          display: block;
          font-size: 0.82rem;
          color: #535C55;
          text-decoration: none;
          margin-bottom: 0.65rem;
          transition: color 0.15s;
        }
        .lp-footer__links-col a:hover {
          color: #123826;
        }
        .lp-footer__newsletter-col p {
          font-size: 0.8rem;
          color: #535C55;
          margin: 0 0 0.85rem;
        }
        .lp-newsletter-form {
          display: flex;
          align-items: center;
          background: #ffffff;
          border: 1px solid #DFD7CA;
          border-radius: 8px;
          overflow: hidden;
        }
        .lp-newsletter-form input {
          border: none;
          outline: none;
          padding: 0.55rem 0.85rem;
          font-size: 0.78rem;
          flex: 1;
        }
        .lp-newsletter-form button {
          background: #123826;
          color: #fff;
          border: none;
          padding: 0.55rem 0.85rem;
          cursor: pointer;
        }
        .newsletter-thankyou {
          font-size: 0.75rem;
          color: #123826;
          margin-top: 0.4rem;
          display: block;
        }
        .lp-footer__bottom {
          max-width: 1240px;
          margin: 1.5rem auto 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1.5rem;
        }
        .lp-social-links {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }
        .lp-social-links a {
          color: #535C55;
          text-decoration: none;
          transition: color 0.15s;
        }
        .lp-social-links a:hover { color: #123826; }
        .lp-footer__credits {
          display: flex;
          align-items: center;
          gap: 1rem;
          text-align: right;
        }
        .credits-label {
          font-size: 0.65rem;
          letter-spacing: 0.12em;
          color: #848E86;
          display: block;
        }
        .credits-names {
          font-size: 0.82rem;
          color: #1B211E;
          display: block;
        }
        .credits-sub {
          font-size: 0.72rem;
          color: #535C55;
        }

        @media (max-width: 1024px) {
          .lp-footer__top {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 768px) {
          .lp-arch-window {
            width: 280px;
            height: 380px;
          }
          .lp-footer__top {
            grid-template-columns: 1fr;
          }
          .lp-footer__bottom {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}
