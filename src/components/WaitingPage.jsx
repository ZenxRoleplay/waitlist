import React from 'react';
import './WaitingPage.css';
import { ReactComponent as HiveoutLogo } from '../img/hiveout_logo.svg';

// ── Tight hex grid (pointy-top, pixel-perfect tiling) ───────────────────────
const R        = 72;
const HEX_W    = Math.sqrt(3) * R;
const COL_STEP = HEX_W;
const ROW_STEP = 1.5 * R;
const GRID_COLS = 18;
const GRID_ROWS = 13;

const HEX_CELLS = Array.from({ length: GRID_COLS * GRID_ROWS }, (_, i) => {
  const row = Math.floor(i / GRID_COLS);
  const col = i % GRID_COLS;
  const px  = Math.round(col * COL_STEP + (row % 2 === 1 ? COL_STEP / 2 : 0));
  const py  = Math.round(row * ROW_STEP);
  const glow = (col * 4 + row * 7) % 9 === 0;
  return { id: i, px, py, glow, delay: ((i * 1.618) % 14).toFixed(1), dur: 5 + (i % 5) };
});

const FEATURES = [
  { label: 'The Buzz',    desc: 'Your live campus feed'   },
  { label: 'Buzz Events', desc: 'College fests & events'  },
  { label: 'Buzz Alerts', desc: 'Real-time notifications' },
  { label: 'The Hive',    desc: 'Your campus community'   },
];

const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
  </svg>
);

const SunIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

export default function WaitingPage({ theme, toggleTheme }) {
  return (
    <main className="waiting-root">
      <div className="hex-bg" aria-hidden="true">
        {HEX_CELLS.map(c => (
          <div
            key={c.id}
            className={`hex-cell${c.glow ? ' glow' : ''}`}
            style={{ left: `${c.px}px`, top: `${c.py}px`, '--delay': `${c.delay}s`, '--dur': `${c.dur}s` }}
          />
        ))}
      </div>

      {/* ── Topbar ── */}
      <nav className="topbar" role="navigation">
        <HiveoutLogo className="brand-logo" aria-label="hiveout" />
        <button className="theme-toggle" onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
          <span className="toggle-track">
            <span className="toggle-thumb">
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </span>
          </span>
        </button>
      </nav>

      {/* ── Hero ── */}
      <section className="hero" aria-labelledby="hero-heading">
        <span className="section-label">Launching Soon in Mumbai</span>
        <h1 className="hero-title" id="hero-heading">
          Mumbai's College<br />
          <span className="title-accent">Fest Platform.</span>
        </h1>
        <p className="hero-tagline">the buzz in your city</p>
        <p className="hero-sub">
          Discover events, join your community, and stay in the buzz.
        </p>
        <a
          href="https://www.instagram.com/hiveout.in"
          target="_blank"
          rel="noopener noreferrer"
          className="insta-btn"
        >
          <InstagramIcon />
          <span>Follow us on Instagram</span>
        </a>
        {/* Feature chip strip */}
        <div className="hero-chips" aria-hidden="true">
          <span className="hero-chip">College Fests</span>
          <span className="chip-dot" />
          <span className="hero-chip">One Hive</span>
        </div>
      </section>

      {/* ── What is HiveOut ── */}
      <section className="features-section" aria-labelledby="features-heading">
        <div className="section-header">
          <span className="section-label">What is HiveOut</span>
          <h2 className="section-title" id="features-heading">
            Everything Mumbai.<br />One hive.
          </h2>
        </div>
        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <div key={f.label} className="feature-card-wrap" style={{ '--i': i }}>
              <div className="hex-border">
                <div className="feature-card">
                  <span className="feature-label">
                    <span className="feature-hash">#</span>{f.label.replace(/ /g, '')}
                  </span>
                  <span className="feature-desc">{f.desc}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer" role="contentinfo">
        <div className="footer-left">
          <span className="footer-brand">hiveout.in</span>
          <span className="footer-coming-soon">Coming Soon</span>
        </div>
        <div className="footer-center">
          <a href="https://www.instagram.com/hiveout.in" target="_blank" rel="noopener noreferrer" className="footer-link">
            <InstagramIcon /> @hiveout.in
          </a>
          <span className="footer-sep" aria-hidden="true" />
          <a href="mailto:hello@hiveout.in" className="footer-link">hello@hiveout.in</a>
        </div>
      </footer>
    </main>
  );
}

