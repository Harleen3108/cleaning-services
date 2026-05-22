import React, { useState, useEffect } from 'react';
import { apiCall } from '../utils/api';
import { Star } from 'lucide-react';

const Testimonials = () => {
  const [reviews, setReviews] = useState([]);

  const fallbackReviews = [
    {
      _id: '1',
      user: { name: 'Sarah Jenkins' },
      rating: 5,
      comment: 'Excellent deep cleaning! The team cleaned every corner of our villa, including high ceilings and behind heavy appliances. Highly professional staff and sparkling clean results.',
      createdAt: new Date().toISOString()
    },
    {
      _id: '2',
      user: { name: 'Michael Chen' },
      rating: 5,
      comment: 'We booked the Sofa and Carpet Cleaning. The agents removed red wine stains that had been there for six months. Highly professional and friendly service.',
      createdAt: new Date().toISOString()
    },
    {
      _id: '3',
      user: { name: 'David Smith' },
      rating: 4,
      comment: 'Very good office cleaning contract. Cleaned over the weekend, left our entire floor sanitized and smelling fresh for Monday morning. Excellent customer support.',
      createdAt: new Date().toISOString()
    }
  ];

  const fetchReviews = async () => {
    try {
      const res = await apiCall('/reviews');
      if (res.success && res.data.length > 0) {
        setReviews(res.data);
      } else {
        setReviews(fallbackReviews);
      }
    } catch (err) {
      console.error('Failed to fetch reviews, using fallbacks', err);
      setReviews(fallbackReviews);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);


  return (
    <section className="testimonials-section" id="testimonials">
      <div className="container">
        <div className="section-header text-center">
          <span className="section-label">TESTIMONIALS & REVIEWS</span>
          <h2 className="section-title">What Our Clients Say About Us</h2>
        </div>

        {/* Reviews Grid */}
        <div className="testimonials-grid">
          {reviews.map((r) => (
            <div key={r._id} className="testimonial-card">
              <div className="stars-row">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    className={i < r.rating ? "star-icon active" : "star-icon"} 
                    fill={i < r.rating ? "#ffc107" : "none"}
                  />
                ))}
              </div>
              <p className="testimonial-comment">"{r.comment}"</p>
              <div className="testimonial-author">
                <div className="author-avatar">{r.user?.name ? r.user.name[0] : 'U'}</div>
                <div className="author-meta">
                  <h4 className="author-name">{r.user?.name || 'Valued Customer'}</h4>
                  <p className="author-date">{new Date(r.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Testimonials;
