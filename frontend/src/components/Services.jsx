import React, { useState, useEffect, useRef } from 'react';
import { apiCall } from '../utils/api';
import { Star, ChevronRight, ChevronLeft } from 'lucide-react';

// Deterministic rating + review count
const pseudoRating = (id = '') => {
  const n = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const rating = ((46 + (n % 4)) / 10).toFixed(1);
  const counts = ['1.2k', '860', '2.1k', '740', '1.5k', '990', '3.2k', '620'];
  return { rating, count: counts[n % counts.length] };
};

// Show discount badge on ~half of cards deterministically
const pseudoDiscount = (id = '') => {
  const n = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  if (n % 3 === 0) return '15% OFF';
  if (n % 3 === 1) return null;
  return '10% OFF';
};

const fallbackServices = [
  {
    _id: '1',
    name: 'Regular Domestic Cleaning',
    price: 11999,
    category: 'Deep Cleaning',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop'
  },
  {
    _id: '2',
    name: 'Carpet & Upholstery Cleaning',
    price: 23999,
    category: 'Deep Cleaning',
    image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?q=80&w=600&auto=format&fit=crop'
  },
  {
    _id: '3',
    name: 'Window Washing Wizards',
    price: 13999,
    category: 'Deep Cleaning',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop'
  },
  {
    _id: '4',
    name: 'After Building Cleaning',
    price: 34999,
    category: 'Deep Cleaning',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop'
  },
  {
    _id: '5',
    name: 'Post-Construction Cleaning',
    price: 49999,
    category: 'Deep Cleaning',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop'
  },
  {
    _id: '6',
    name: 'Bed Bugs Thermal Treatment',
    price: 19999,
    category: 'Pest Control',
    image: '/pest-control.png'
  },
  {
    _id: '7',
    name: 'Termite Protection Barrier',
    price: 39999,
    category: 'Pest Control',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop'
  }
];

const Services = ({ onSelectService }) => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [loadingCats, setLoadingCats] = useState(true);
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 280, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCats(true);
      try {
        const res = await apiCall('/categories');
        if (res.success && res.data && res.data.length > 0) {
          const activeCats = res.data.filter(c => c.isActive);
          setCategories(activeCats);
          if (activeCats.length > 0) setActiveCategory(activeCats[0].name);
        } else {
          const uniqueCats = [...new Set(fallbackServices.map(s => s.category))];
          setCategories(uniqueCats.map(name => ({ name, isActive: true })));
          setActiveCategory(uniqueCats[0]);
        }
      } catch (err) {
        const uniqueCats = [...new Set(fallbackServices.map(s => s.category))];
        setCategories(uniqueCats.map(name => ({ name, isActive: true })));
        setActiveCategory(uniqueCats[0]);
      }
      setLoadingCats(false);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!activeCategory) return;
    const fetchServices = async () => {
      try {
        const res = await apiCall('/services');
        if (res.success && res.data.length > 0) {
          setServices(res.data);
        } else {
          setServices(fallbackServices);
        }
      } catch (err) {
        setServices(fallbackServices);
      }
    };
    fetchServices();
  }, [activeCategory]);

  const filteredServices = services.filter(s => s.category === activeCategory);

  const handleCategorySwitch = (catName) => {
    setActiveCategory(catName);
    if (scrollRef.current) scrollRef.current.scrollLeft = 0;
  };

  return (
    <section className="services-section" id="services">
      <div className="container">
        <div className="services-header-block">
          <h2 className="section-title">Most booked services</h2>

          <div className="services-main-tabs">
            {loadingCats ? (
              <div className="tabs-loading">Loading...</div>
            ) : (
              categories.map(cat => (
                <button
                  key={cat._id || cat.name}
                  className={`main-tab-btn ${activeCategory === cat.name ? 'active' : ''}`}
                  onClick={() => handleCategorySwitch(cat.name)}
                >
                  {cat.name}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Scrollable card rail with arrow buttons */}
        <div className="uc-scroll-rail-wrap">
          <button className="uc-rail-arrow uc-rail-left" onClick={() => scroll(-1)} aria-label="Scroll left">
            <ChevronLeft size={22} />
          </button>

          <div className="uc-services-grid" ref={scrollRef}>
            {filteredServices.map(s => {
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
      </div>
    </section>
  );
};

export default Services;
