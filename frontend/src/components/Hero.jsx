import React, { useState, useEffect } from 'react';
import { PhoneCall, Star } from 'lucide-react';
import { apiCall } from '../utils/api';

// Real photos representing each service category.
const photo = (id) =>
  `https://images.unsplash.com/photo-${id}?q=80&w=200&h=200&auto=format&fit=crop`;

const heroCategories = [
  { img: photo('1581578731548-c64695cc6952'), label: 'Home Cleaning' },
  { img: photo('1600585154340-be6161a56a0c'), label: 'Deep Cleaning' },
  { img: photo('1527515637462-cff94eecc1ac'), label: 'Sofa & Carpet' },
  { img: '/pest-control.png', label: 'Pest Control' },
  { img: photo('1497366216548-37526070297c'), label: 'Office Cleaning' },
  { img: photo('1560518883-ce09059eeffa'), label: 'Bathroom Clean' },
];

const Hero = ({ onOpenBooking, onSelectCategory }) => {
  const [cmsData, setCmsData] = useState({
    badge: 'CLEANING SERVICES',
    title: 'Cleaning with Care Every Time',
    subtitle: 'This includes basic cleaning tasks in homes such as dusting, vacuuming, mopping floors, cleaning bathrooms, and kitchens.',
    buttonText: 'DISCOVER MORE',
    phone: '+91 98765 43210',
    image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?q=80&w=600&auto=format&fit=crop'
  });

  useEffect(() => {
    const fetchCMS = async () => {
      try {
        const res = await apiCall('/cms/hero');
        if (res.success && res.data) {
          setCmsData(prev => ({ ...prev, ...res.data }));
        }
      } catch (err) {
        // Silently use defaults
      }
    };
    fetchCMS();
  }, []);

  return (
    <section className="hero-section uc-hero" id="home">
      <div className="container hero-container">
        <div className="hero-content">
          <span className="hero-subtitle">{cmsData.badge}</span>
          <h1 className="hero-title">
            {cmsData.title.split('\\n').map((line, i) => (
              <span key={i}>{line}{i < cmsData.title.split('\\n').length - 1 && <br />}</span>
            ))}
          </h1>
          <p className="hero-desc">{cmsData.subtitle}</p>

          {/* Urban Company-style service picker panel */}
          <div className="uc-service-panel">
            <span className="uc-panel-label">What are you looking for?</span>
            <div className="uc-category-tiles">
              {heroCategories.map((cat, i) => (
                <button key={i} className="uc-category-tile" onClick={() => onSelectCategory ? onSelectCategory(cat.label) : onOpenBooking()}>
                  <span className="uc-tile-icon">
                    <img src={cat.img} alt={cat.label} loading="lazy" />
                  </span>
                  <span className="uc-tile-label">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="hero-cta-buttons">
            <button className="hero-primary-btn" onClick={onOpenBooking}>
              {cmsData.buttonText || 'DISCOVER MORE'} &gt;
            </button>
            <div className="hero-phone-cta">
              <div className="phone-icon-holder">
                <PhoneCall size={20} />
              </div>
              <div className="phone-cta-text">
                <span className="phone-cta-label">Call Any Time</span>
                <a href={`tel:${cmsData.phone?.replace(/\D/g, '')}`} className="phone-cta-num">{cmsData.phone}</a>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-image-area">
          <div className="cleaner-img-wrapper uc-hero-collage">
            <img
              src={cmsData.image || 'https://images.unsplash.com/photo-1563453392212-326f5e854473?q=80&w=600&auto=format&fit=crop'}
              alt="Professional Cleaner"
              className="cleaner-main-img"
            />
            {/* Round badges */}
            <div className="experience-badge animate-bounce">
              <span className="exp-num">12+</span>
              <span className="exp-lbl">Years Experience</span>
            </div>
            <div className="uc-rating-badge">
              <Star size={18} fill="#ffd000" strokeWidth={0} />
              <span className="uc-rating-num">4.8</span>
              <span className="uc-rating-lbl">12K+ reviews</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
