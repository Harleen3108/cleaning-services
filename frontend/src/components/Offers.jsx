import React, { useState, useEffect } from 'react';
import { apiCall } from '../utils/api';

const fallbackOffers = [
  {
    id: '1',
    title: 'Sofa deep cleaning\nstarting at ₹599',
    subtitle: '',
    buttonText: 'Book now',
    image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?q=80&w=800&auto=format&fit=crop',
    bgColor: '#3d2000',
    isActive: true,
  },
  {
    id: '2',
    title: 'Shine your bathroom\ndeserves',
    subtitle: 'Deep bathroom sanitization',
    buttonText: 'Book now',
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=800&auto=format&fit=crop',
    bgColor: '#006b6b',
    isActive: true,
  },
  {
    id: '3',
    title: 'Relax & rejuvenate\nat home',
    subtitle: 'Full home deep clean',
    buttonText: 'Book now',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
    bgColor: '#4a5c00',
    isActive: true,
  },
];

const Offers = ({ onOpenBooking }) => {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await apiCall('/cms/offers');
        if (res.success && res.data && Array.isArray(res.data.items) && res.data.items.length > 0) {
          setOffers(res.data.items.filter(o => o.isActive !== false));
        } else {
          setOffers(fallbackOffers);
        }
      } catch (err) {
        setOffers(fallbackOffers);
      }
    };
    fetchOffers();
  }, []);

  if (!offers.length) return null;

  return (
    <section className="offers-section">
      <div className="container">
        <div className="offers-header">
          <h2 className="offers-title">Offers &amp; discounts</h2>
        </div>
        <div className="offers-grid">
          {offers.map((offer, i) => (
            <div
              key={offer.id || i}
              className="offer-card"
              style={{ backgroundColor: offer.bgColor || '#1c1c1c' }}
            >
              {/* Background image */}
              {offer.image && (
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="offer-card-img"
                  loading="lazy"
                />
              )}
              {/* Overlay */}
              <div
                className="offer-card-overlay"
                style={{ background: `linear-gradient(to right, ${offer.bgColor || '#1c1c1c'} 40%, transparent 100%)` }}
              />
              {/* Content */}
              <div className="offer-card-content">
                <h3 className="offer-card-title">
                  {offer.title.split('\n').map((line, li) => (
                    <span key={li}>{line}{li < offer.title.split('\n').length - 1 && <br />}</span>
                  ))}
                </h3>
                {offer.subtitle && (
                  <p className="offer-card-subtitle">{offer.subtitle}</p>
                )}
                <button className="offer-card-btn" onClick={onOpenBooking}>
                  {offer.buttonText || 'Book now'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Offers;
