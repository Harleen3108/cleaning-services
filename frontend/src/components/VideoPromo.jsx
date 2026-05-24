import React, { useState, useRef, useEffect } from 'react';

const slides = [
  {
    id: 1,
    badge: 'Up to ₹1,500 off',
    title: 'Home Deep Cleaning',
    subtitle: 'Every corner scrubbed, every surface spotless.',
    cta: 'Book Now',
    // "Professional Home Deep Cleaning Service | HandyMama"
    ytId: 'hCDHNsmZV0s',
    gradient: 'linear-gradient(135deg, #1a0533 0%, #3b1278 50%, #692ca8 100%)',
  },
  {
    id: 2,
    badge: '20% OFF',
    title: 'Sofa & Upholstery Cleaning',
    subtitle: 'Deep-cleaned, odour-free and looking brand new.',
    cta: 'Book Now',
    // "DEEP CLEANING a FILTHY sofa || Satisfying upholstery cleaning"
    ytId: 'TyMI10oILmg',
    gradient: 'linear-gradient(135deg, #0a2540 0%, #1a4a7a 50%, #2d7dd2 100%)',
  },
  {
    id: 3,
    badge: 'Starts at ₹299',
    title: 'Pest Control',
    subtitle: 'Safe, certified treatment — bugs out for good.',
    cta: 'Book Now',
    // "How To Spray Home Like A Pest Control Pro!"
    ytId: 'OmWNoz3P1YM',
    gradient: 'linear-gradient(135deg, #0d2b0a 0%, #1e5c19 50%, #2e8b22 100%)',
  },
  {
    id: 4,
    badge: 'Best Seller',
    title: 'Kitchen Deep Clean',
    subtitle: 'Grease-free, germ-free kitchen in just a few hours.',
    cta: 'Book Now',
    // "How A Greasy Kitchen Is Professionally Deep Cleaned | Insider"
    ytId: 'QVbG_oKLeL0',
    gradient: 'linear-gradient(135deg, #2a1a00 0%, #7a4a00 50%, #c87800 100%)',
  },
];

const ytSrc = (ytId) =>
  `https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&enablejsapi=1`;

const VideoPromo = ({ onOpenBooking }) => {
  const [active, setActive] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const timerRef = useRef(null);

  const resetTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive(prev => (prev + 1) % slides.length);
    }, 8000);
  };

  const goTo = (idx) => {
    if (idx === active || transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      setActive(idx);
      setTransitioning(false);
    }, 400);
  };

  useEffect(() => {
    resetTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  const slide = slides[active];

  return (
    <section className="vp-section">
      {/* Gradient fallback — always visible */}
      <div
        className="vp-gradient-bg"
        style={{ background: slide.gradient, transition: 'background 0.6s ease' }}
      />

      {/* YouTube background iframes — one per slide, only active shown */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={`vp-yt-wrap ${i === active ? 'vp-yt-wrap--active' : ''} ${transitioning ? 'vp-yt-wrap--fade' : ''}`}
        >
          {/* Only render iframe when slide is active or adjacent (perf) */}
          {Math.abs(i - active) <= 1 && (
            <iframe
              src={ytSrc(s.ytId)}
              title={s.title}
              frameBorder="0"
              allow="autoplay; encrypted-media"
              className="vp-yt-iframe"
            />
          )}
        </div>
      ))}

      {/* Dark gradient overlay */}
      <div className="vp-overlay" />

      {/* Text content */}
      <div className={`vp-content ${transitioning ? 'vp-content--out' : 'vp-content--in'}`}>
        {slide.badge && <span className="vp-badge">{slide.badge}</span>}
        <h2 className="vp-title">{slide.title}</h2>
        <p className="vp-subtitle">{slide.subtitle}</p>
        <button className="vp-cta" onClick={() => onOpenBooking && onOpenBooking()}>
          {slide.cta}
        </button>
      </div>

      {/* Dot navigation */}
      <div className="vp-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`vp-dot ${i === active ? 'vp-dot--active' : ''}`}
            onClick={() => { resetTimer(); goTo(i); }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default VideoPromo;
