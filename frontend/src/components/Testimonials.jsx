import React from 'react';
import { Star, Quote } from 'lucide-react';

// Curated homepage testimonials — always shown (not overridden by API)
const curatedReviews = [
  {
    _id: 'c1',
    user: { name: 'Priya Sharma' },
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    service: 'Home Deep Cleaning',
    rating: 5,
    comment: 'Absolutely loved the service! The team cleaned every corner of our 3BHK, including behind the fridge and inside the cabinets. My house has never looked this spotless. Will book again!',
    createdAt: '2026-04-03T10:00:00Z',
  },
  {
    _id: 'c2',
    user: { name: 'Rahul Verma' },
    avatar: 'https://randomuser.me/api/portraits/men/46.jpg',
    service: 'Sofa & Upholstery Cleaning',
    rating: 5,
    comment: 'Our sofa had chai stains that were months old — they removed every single one! The team was punctual, professional and very courteous. Highly recommended.',
    createdAt: '2026-04-11T09:00:00Z',
  },
  {
    _id: 'c3',
    user: { name: 'Sneha Patel' },
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    service: 'Kitchen Deep Clean',
    rating: 5,
    comment: 'The kitchen deep clean was worth every rupee. Grease on the chimney and tiles that I had given up on — all gone! Used eco-friendly products and finished in under 3 hours. Superb!',
    createdAt: '2026-04-19T11:00:00Z',
  },
  {
    _id: 'c4',
    user: { name: 'Arjun Nair' },
    avatar: 'https://randomuser.me/api/portraits/men/52.jpg',
    service: 'Pest Control',
    rating: 5,
    comment: 'Had a severe cockroach problem for weeks. Booked the pest control and within 2 days the issue was completely resolved. Safe for kids and pets. Very happy with the results!',
    createdAt: '2026-04-27T08:00:00Z',
  },
  {
    _id: 'c5',
    user: { name: 'Meera Iyer' },
    avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
    service: 'Bathroom Sanitization',
    rating: 5,
    comment: 'Booked the bathroom sanitization for our new flat before moving in. The team was thorough, used hospital-grade disinfectants and left the place spotless. Excellent attention to detail!',
    createdAt: '2026-05-05T14:00:00Z',
  },
  {
    _id: 'c6',
    user: { name: 'Vikram Reddy' },
    avatar: 'https://randomuser.me/api/portraits/men/71.jpg',
    service: 'Office Cleaning',
    rating: 4,
    comment: 'Booked a weekend office clean for our entire floor. Everything was sanitized and smelling fresh for Monday morning. Very professional team, great customer support throughout.',
    createdAt: '2026-05-13T09:30:00Z',
  },
  {
    _id: 'c7',
    user: { name: 'Ananya Singh' },
    avatar: 'https://randomuser.me/api/portraits/women/57.jpg',
    service: 'Move-In Cleaning',
    rating: 5,
    comment: 'Hired Cleannes for a move-in deep clean and could not be more impressed. Every room was transformed — walls, fans, grills, everything. Made settling into our new home so much easier!',
    createdAt: '2026-05-21T16:00:00Z',
  },
];

const Testimonials = () => {
  return (
    <section className="testimonials-section" id="testimonials">
      <div className="container">
        <div className="section-header text-center">
          <span className="section-label">TESTIMONIALS &amp; REVIEWS</span>
          <h2 className="section-title">What Our Clients Say About Us</h2>
          <p className="section-subtitle">Trusted by thousands of happy homes across India</p>
        </div>

        <div className="testimonials-grid testimonials-grid--4col">
          {curatedReviews.map((r, idx) => {
            const avatarSrc = r.avatar || null;
            const userName = typeof r.user === 'string' ? r.user : (r.user?.name || 'Valued Customer');
            const initials = userName[0]?.toUpperCase() || 'U';
            const service = typeof r.service === 'string' ? r.service : (r.service?.name || '');
            const dateStr = new Date(r.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'short', year: 'numeric',
            });

            return (
              <div key={r._id || idx} className="testimonial-card tcard-v2">
                {/* Quote icon */}
                <div className="tcard-quote-icon">
                  <Quote size={22} />
                </div>

                {/* Stars */}
                <div className="stars-row">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={15}
                      fill={i < r.rating ? '#fbbf24' : 'none'}
                      stroke={i < r.rating ? '#fbbf24' : '#d1d5db'}
                      strokeWidth={1.5}
                    />
                  ))}
                </div>

                {/* Service badge */}
                {service && (
                  <span className="tcard-service-badge">{service}</span>
                )}

                {/* Comment */}
                <p className="testimonial-comment">"{r.comment}"</p>

                {/* Author */}
                <div className="testimonial-author">
                  {avatarSrc ? (
                    <img
                      src={avatarSrc}
                      alt={userName}
                      className="author-avatar-img"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div
                    className="author-avatar"
                    style={{ display: avatarSrc ? 'none' : 'flex' }}
                  >
                    {initials}
                  </div>
                  <div className="author-meta">
                    <h4 className="author-name">{userName}</h4>
                    <p className="author-date">{dateStr}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
