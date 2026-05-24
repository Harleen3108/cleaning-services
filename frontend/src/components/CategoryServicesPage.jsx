import React, { useState, useEffect } from 'react';
import { apiCall } from '../utils/api';
import {
  Star, MapPin, Search, ArrowLeft, ChevronRight,
  CheckCircle, X, ShieldCheck, Clock, Tag
} from 'lucide-react';

/* ── helpers ───────────────────────────────────────────── */
const pseudoRating = (id = '') => {
  const n = String(id).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const rating = ((46 + (n % 4)) / 10).toFixed(1);
  const counts = ['1.2k', '860', '2.1k', '740', '1.5k', '990', '3.2k', '620'];
  return { rating, count: counts[n % counts.length] };
};
const pseudoDiscount = (id = '') => {
  const n = String(id).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  if (n % 3 === 0) return '15% OFF';
  if (n % 3 === 1) return null;
  return '10% OFF';
};

const fallbackServices = [
  { _id: 'f1', name: 'Regular Domestic Cleaning',    category: 'Home Cleaning',   price: 11999, image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop', description: 'Standard home cleaning covering all rooms, dusting, mopping and sanitising.' },
  { _id: 'f2', name: 'Carpet & Upholstery Cleaning', category: 'Deep Cleaning',   price: 23999, image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?q=80&w=600&auto=format&fit=crop', description: 'Professional deep extraction cleaning for carpets, sofas and fabric furniture.' },
  { _id: 'f3', name: 'Window Washing Wizards',       category: 'Deep Cleaning',   price: 13999, image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop', description: 'Streak-free interior and exterior window cleaning for homes and offices.' },
  { _id: 'f4', name: 'After Building Cleaning',      category: 'Deep Cleaning',   price: 34999, image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop', description: 'Post-renovation dust, debris and construction residue removal.' },
  { _id: 'f5', name: 'Post-Construction Cleaning',   category: 'Deep Cleaning',   price: 49999, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop', description: 'Full site cleanup after new construction or major renovation work.' },
  { _id: 'f6', name: 'Bed Bugs Thermal Treatment',   category: 'Pest Control',    price: 19999, image: '/pest-control.png',                                                                             description: 'Heat treatment that eliminates bed bugs at all life stages.' },
  { _id: 'f7', name: 'Termite Protection Barrier',   category: 'Pest Control',    price: 39999, image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop', description: 'Chemical soil barrier preventing termite entry for 5+ years.' },
  { _id: 'f8', name: 'Sofa Steam Cleaning',          category: 'Sofa & Carpet',   price: 8999,  image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?q=80&w=600&auto=format&fit=crop', description: 'High-temperature steam cleaning for sofas and upholstery.' },
  { _id: 'f9', name: 'Office Deep Sanitisation',     category: 'Office Cleaning', price: 17999, image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop', description: 'Complete office cleaning and disinfection for a hygienic workspace.' },
  { _id: 'f10', name: 'Bathroom & Toilet Deep Clean', category: 'Bathroom Clean', price: 5999,  image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=600&auto=format&fit=crop', description: 'Thorough bathroom scrubbing, tile cleaning, and odour elimination.' },
];

/* ── ServiceDetailPanel ────────────────────────────────── */
const ServiceDetailPanel = ({ service, onBook, onClose }) => {
  const [address, setAddress]           = useState('');
  const [suggestions, setSuggestions]   = useState([]);
  const [searching, setSearching]       = useState(false);
  const [chosenAddress, setChosenAddress] = useState('');

  const { rating, count } = pseudoRating(service._id);
  const price    = service.minPrice || service.price || 299;
  const original = Math.round(price * 1.18);
  const discount = pseudoDiscount(service._id);

  /* Nominatim autocomplete */
  useEffect(() => {
    if (address.trim().length < 3) { setSuggestions([]); return; }
    const t = setTimeout(async () => {
      setSearching(true);
      try {
        const r = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=5&countrycodes=in`
        );
        setSuggestions(await r.json());
      } catch (_) {}
      setSearching(false);
    }, 500);
    return () => clearTimeout(t);
  }, [address]);

  const pickSuggestion = (place) => {
    setChosenAddress(place.display_name);
    setAddress(place.display_name);
    setSuggestions([]);
  };

  return (
    <div className="csvc-detail-overlay" onClick={onClose}>
      <div className="csvc-detail-panel" onClick={e => e.stopPropagation()}>
        {/* Close */}
        <button className="csvc-panel-close" onClick={onClose}><X size={20} /></button>

        {/* Image */}
        <div className="csvc-panel-img-wrap">
          <img src={service.image} alt={service.name} />
          {discount && <span className="csvc-panel-badge">{discount}</span>}
        </div>

        {/* Info */}
        <div className="csvc-panel-body">
          <h2 className="csvc-panel-title">{service.name}</h2>

          <div className="csvc-panel-meta">
            <div className="csvc-panel-rating">
              <Star size={14} fill="#f5a623" color="#f5a623" strokeWidth={0} />
              <span>{rating}</span>
              <span className="csvc-panel-rcount">({count} reviews)</span>
            </div>
            <div className="csvc-panel-price">
              <span className="csvc-panel-price-now">₹{price.toLocaleString('en-IN')}</span>
              {discount && <span className="csvc-panel-price-old">₹{original.toLocaleString('en-IN')}</span>}
            </div>
          </div>

          <p className="csvc-panel-desc">{service.description || 'Professional cleaning service tailored to your needs.'}</p>

          {/* Trust badges */}
          <div className="csvc-panel-badges">
            <span><ShieldCheck size={14} /> Verified Pros</span>
            <span><Clock size={14} /> On-time Guarantee</span>
            <span><Tag size={14} /> Best Price</span>
          </div>

          {/* Location */}
          <div className="csvc-panel-location-section">
            <label className="csvc-loc-label">
              <MapPin size={15} /> Select your location
            </label>
            <div className="csvc-loc-input-wrap">
              <input
                type="text"
                className="csvc-loc-input"
                placeholder="Search area, e.g. Koramangala, Bengaluru…"
                value={address}
                onChange={e => { setAddress(e.target.value); setChosenAddress(''); }}
              />
              {searching && <span className="csvc-loc-spinner">…</span>}
            </div>
            {suggestions.length > 0 && (
              <ul className="csvc-loc-suggestions">
                {suggestions.map((pl, i) => (
                  <li key={i} onClick={() => pickSuggestion(pl)}>
                    <MapPin size={13} className="csvc-suggest-pin" />
                    <span>{pl.display_name}</span>
                  </li>
                ))}
              </ul>
            )}
            {chosenAddress && (
              <div className="csvc-chosen-addr">
                <CheckCircle size={14} className="csvc-addr-check" />
                <span>{chosenAddress}</span>
              </div>
            )}
          </div>

          {/* CTA */}
          <button
            className="csvc-book-btn"
            onClick={() => onBook(service)}
          >
            Book Now — ₹{price.toLocaleString('en-IN')}
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── CategoryServicesPage ──────────────────────────────── */
const CategoryServicesPage = ({ initialCategory, onSelectService, onBack }) => {
  const [categories, setCategories]       = useState([]);
  const [services, setServices]           = useState([]);
  const [activeCategory, setActiveCategory] = useState(initialCategory || '');
  const [loading, setLoading]             = useState(true);
  const [selectedService, setSelectedService] = useState(null);

  /* fetch categories + services once */
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      let svcs = fallbackServices;
      try {
        const res = await apiCall('/services');
        if (res.success && res.data?.length > 0) svcs = res.data;
      } catch (_) {}
      setServices(svcs);

      let cats = [];
      try {
        const res = await apiCall('/categories');
        if (res.success && res.data?.length > 0) {
          cats = res.data.filter(c => c.isActive).map(c => c.name);
        }
      } catch (_) {}
      if (cats.length === 0) cats = [...new Set(svcs.map(s => s.category).filter(Boolean))];
      setCategories(cats);

      /* if initialCategory not in list, fall back to first */
      if (!cats.includes(initialCategory) && cats.length > 0) {
        setActiveCategory(cats[0]);
      }
      setLoading(false);
    };
    load();
  }, []);

  const filtered = services.filter(s => s.category === activeCategory);

  return (
    <div className="csvc-page">
      {/* ── Top breadcrumb bar ── */}
      <div className="csvc-breadcrumb">
        <button className="csvc-back-btn" onClick={onBack}>
          <ArrowLeft size={18} /> Home
        </button>
        <span className="csvc-breadcrumb-sep">/</span>
        <span className="csvc-breadcrumb-current">{activeCategory}</span>
      </div>

      <div className="csvc-layout">
        {/* ── Left sidebar ── */}
        <aside className="csvc-sidebar">
          <h3 className="csvc-sidebar-title">Categories</h3>
          {loading ? (
            <div className="csvc-sidebar-loading">Loading…</div>
          ) : (
            <ul className="csvc-cat-list">
              {categories.map(cat => (
                <li key={cat}>
                  <button
                    className={`csvc-cat-item ${activeCategory === cat ? 'active' : ''}`}
                    onClick={() => { setActiveCategory(cat); setSelectedService(null); }}
                  >
                    <span className="csvc-cat-dot" />
                    {cat}
                    <ChevronRight size={15} className="csvc-cat-arrow" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>

        {/* ── Main content ── */}
        <main className="csvc-main">
          <div className="csvc-main-header">
            <h2 className="csvc-main-title">{activeCategory}</h2>
            <span className="csvc-svc-count">{filtered.length} service{filtered.length !== 1 ? 's' : ''}</span>
          </div>

          {loading ? (
            <div className="csvc-loading-grid">
              {[1,2,3,4,5,6].map(i => <div key={i} className="csvc-skeleton-card" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="csvc-empty-state">
              <p>No services found in this category yet.</p>
            </div>
          ) : (
            <div className="csvc-services-grid">
              {filtered.map(s => {
                const isSvcActive = s.isActive !== false;
                const { rating, count } = pseudoRating(s._id);
                const price    = s.minPrice || s.price || 299;
                const original = Math.round(price * 1.18);
                const discount = pseudoDiscount(s._id);
                return (
                  <div
                    key={s._id}
                    className={`csvc-card ${!isSvcActive ? 'csvc-card-unavail' : ''}`}
                    onClick={() => isSvcActive && setSelectedService(s)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && isSvcActive && setSelectedService(s)}
                  >
                    <div className="csvc-card-img">
                      <img src={s.image} alt={s.name} loading="lazy" />
                      {discount && isSvcActive && <span className="csvc-card-discount">{discount}</span>}
                      {!isSvcActive && <span className="csvc-card-unavail-badge">Unavailable</span>}
                    </div>
                    <div className="csvc-card-body">
                      <h3 className="csvc-card-name">{s.name}</h3>
                      <div className="csvc-card-rating">
                        <Star size={13} fill="#f5a623" color="#f5a623" strokeWidth={0} />
                        <span>{rating}</span>
                        <span className="csvc-card-rcount">({count})</span>
                      </div>
                      <div className="csvc-card-price">
                        <span className="csvc-card-price-now">₹{price.toLocaleString('en-IN')}</span>
                        {discount && <span className="csvc-card-price-old">₹{original.toLocaleString('en-IN')}</span>}
                      </div>
                      {isSvcActive && (
                        <button className="csvc-card-view-btn">
                          View Details <ChevronRight size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* ── Service detail panel (slide-in) ── */}
      {selectedService && (
        <ServiceDetailPanel
          service={selectedService}
          onBook={(svc) => { setSelectedService(null); onSelectService(svc); }}
          onClose={() => setSelectedService(null)}
        />
      )}
    </div>
  );
};

export default CategoryServicesPage;
