import React, { useState, useEffect, useRef } from 'react';
import { apiCall } from '../utils/api';
import { Star, ChevronRight, ChevronLeft, SlidersHorizontal } from 'lucide-react';

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
  { _id: 'f1', name: 'Regular Domestic Cleaning', category: 'Deep Cleaning', price: 11999, image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop' },
  { _id: 'f2', name: 'Carpet & Upholstery Cleaning', category: 'Deep Cleaning', price: 23999, image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?q=80&w=600&auto=format&fit=crop' },
  { _id: 'f3', name: 'Window Washing Wizards', category: 'Deep Cleaning', price: 13999, image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop' },
  { _id: 'f4', name: 'After Building Cleaning', category: 'Deep Cleaning', price: 34999, image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop' },
  { _id: 'f5', name: 'Post-Construction Cleaning', category: 'Deep Cleaning', price: 49999, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop' },
  { _id: 'f6', name: 'Bed Bugs Thermal Treatment', category: 'Pest Control', price: 19999, image: '/pest-control.png' },
  { _id: 'f7', name: 'Termite Protection Barrier', category: 'Pest Control', price: 39999, image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop' },
];

const AllServices = ({ onSelectService }) => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 280, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      let svcs = fallbackServices;
      try {
        const res = await apiCall('/services');
        if (res.success && res.data && res.data.length > 0) svcs = res.data;
      } catch (err) {}
      setServices(svcs);

      try {
        const catRes = await apiCall('/categories');
        if (catRes.success && catRes.data && catRes.data.length > 0) {
          setCategories(catRes.data.filter(c => c.isActive).map(c => c.name));
        } else {
          setCategories([...new Set(svcs.map(s => s.category).filter(Boolean))]);
        }
      } catch (err) {
        setCategories([...new Set(svcs.map(s => s.category).filter(Boolean))]);
      }
      setLoading(false);
    };
    load();
  }, []);

  const filtered = activeFilter === 'all'
    ? services
    : services.filter(s => s.category === activeFilter);

  const handleFilterChange = (cat) => {
    setActiveFilter(cat);
    if (scrollRef.current) scrollRef.current.scrollLeft = 0;
  };

  return (
    <section className="uc-allservices-section" id="all-services">
      <div className="container">
        <div className="uc-allsvc-header">
          <div className="uc-allsvc-heading">
            <h2 className="section-title">Explore our cleaning services</h2>
          </div>

          <div className="uc-allsvc-filter">
            <div className="uc-filter-pills">
              <button
                className={`uc-filter-pill ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={() => handleFilterChange('all')}
              >
                All
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`uc-filter-pill ${activeFilter === cat ? 'active' : ''}`}
                  onClick={() => handleFilterChange(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">Loading services...</div>
        ) : filtered.length === 0 ? (
          <div className="loading-state">No services found in this category.</div>
        ) : (
          <div className="uc-scroll-rail-wrap">
            <button className="uc-rail-arrow uc-rail-left" onClick={() => scroll(-1)} aria-label="Scroll left">
              <ChevronLeft size={22} />
            </button>

            <div className="uc-services-grid" ref={scrollRef}>
              {filtered.map(s => {
                const isSvcActive = s.isActive !== false;
                const { rating, count } = pseudoRating(s._id);
                const price = s.minPrice || s.price || 299;
                const original = Math.round(price * 1.18);
                const discount = pseudoDiscount(s._id);
                return (
                  <div
                    key={s._id}
                    className={`uc-service-card ${!isSvcActive ? 'uc-svc-unavailable' : ''}`}
                    onClick={() => isSvcActive && onSelectService(s)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="uc-svc-img-wrap">
                      <img src={s.image} alt={s.name} loading="lazy" />
                      {discount && isSvcActive && (
                        <span className="uc-discount-badge">{discount}</span>
                      )}
                      {!isSvcActive && (
                        <span className="uc-unavail-badge">Unavailable</span>
                      )}
                    </div>
                    <div className="uc-svc-body">
                      <h3 className="uc-svc-name">{s.name}</h3>
                      <div className="uc-svc-rating">
                        <Star size={13} fill="#f5a623" color="#f5a623" strokeWidth={0} />
                        <span className="uc-svc-rating-val">{rating}</span>
                        <span className="uc-svc-rating-count">({count})</span>
                      </div>
                      <div className="uc-svc-price">
                        <span className="uc-price-now">₹{price.toLocaleString('en-IN')}</span>
                        {discount && <span className="uc-price-old">₹{original.toLocaleString('en-IN')}</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button className="uc-rail-arrow uc-rail-right" onClick={() => scroll(1)} aria-label="Scroll right">
              <ChevronRight size={22} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default AllServices;
