import React, { useState, useEffect } from 'react';
import { apiCall } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Star, MessageSquarePlus, CheckCircle } from 'lucide-react';

const Testimonials = () => {
  const { isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

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

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!comment.trim()) {
      setErrorMsg('Please enter a review comment');
      return;
    }

    setSubmitting(true);
    try {
      const res = await apiCall('/reviews', 'POST', { rating, comment });
      if (res.success) {
        setSuccessMsg('Thank you! Your review has been submitted for moderation and will appear soon.');
        setComment('');
        setRating(5);
        fetchReviews();
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit review');
    }
    setSubmitting(false);
  };

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

        {/* Submit Review Section */}
        <div className="submit-review-box">
          <div className="submit-review-header">
            <MessageSquarePlus size={24} className="accent-color" />
            <h3>Share Your Experience</h3>
          </div>

          {isAuthenticated ? (
            <form onSubmit={handleSubmitReview} className="review-form">
              {successMsg && (
                <div className="alert alert-success">
                  <CheckCircle size={16} /> <span>{successMsg}</span>
                </div>
              )}
              {errorMsg && <div className="alert alert-error">{errorMsg}</div>}

              <div className="form-group-row">
                <label className="rating-select-label">Your Rating:</label>
                <div className="rating-stars-picker">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="star-picker-btn"
                    >
                      <Star
                        size={24}
                        fill={star <= rating ? "#ffc107" : "none"}
                        className={star <= rating ? "star-icon active" : "star-icon"}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <textarea
                  className="form-textarea"
                  placeholder="Tell us what you liked about our service, staff behavior, cleanliness level..."
                  rows="4"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>
              </div>

              <button type="submit" className="submit-review-btn" disabled={submitting}>
                {submitting ? 'Submitting...' : 'SUBMIT REVIEW'}
              </button>
            </form>
          ) : (
            <div className="auth-prompt-card">
              <p>You must be signed in to submit a rating and review.</p>
              <span className="auth-prompt-note">Please sign in from the top navigation bar.</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
