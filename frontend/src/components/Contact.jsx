import React, { useState, useEffect } from 'react';
import { apiCall } from '../utils/api';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react';

const Contact = ({ onOpenBooking }) => {
  const [info, setInfo] = useState({
    phone: '+91 98765 43210',
    email: 'support@cleannes.in',
    address: 'Koramangala, Bengaluru, Karnataka 560034',
  });

  // Local-only form state (no backend contact endpoint — submits client-side).
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const fetchCMS = async () => {
      try {
        const res = await apiCall('/cms/footer');
        if (res.success && res.data) {
          setInfo((prev) => ({ ...prev, ...res.data }));
        }
      } catch (err) {
        // use defaults
      }
    };
    fetchCMS();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSent(true);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <section className="uc-contact-section">
      <div className="container">
        <div className="uc-contact-grid">
          {/* Left — info cards */}
          <div className="uc-contact-info">
            <span className="section-label">GET IN TOUCH</span>
            <h2 className="section-title">We'd love to hear from you</h2>
            <p className="uc-contact-lead">
              Questions about a service, pricing, or scheduling? Reach out and our team
              will get back to you shortly.
            </p>

            <div className="uc-contact-cards">
              <div className="uc-contact-card">
                <span className="uc-cc-icon"><Phone size={20} /></span>
                <div>
                  <h4>Call us</h4>
                  <a href={`tel:${info.phone?.replace(/\D/g, '')}`}>{info.phone}</a>
                </div>
              </div>
              <div className="uc-contact-card">
                <span className="uc-cc-icon"><Mail size={20} /></span>
                <div>
                  <h4>Email us</h4>
                  <a href={`mailto:${info.email}`}>{info.email}</a>
                </div>
              </div>
              <div className="uc-contact-card">
                <span className="uc-cc-icon"><MapPin size={20} /></span>
                <div>
                  <h4>Visit us</h4>
                  <span>{info.address}</span>
                </div>
              </div>
              <div className="uc-contact-card">
                <span className="uc-cc-icon"><Clock size={20} /></span>
                <div>
                  <h4>Working hours</h4>
                  <span>Mon – Sun, 7:00 AM – 9:00 PM</span>
                </div>
              </div>
            </div>

            <div className="uc-contact-map">
              <iframe
                title="Cleannes location"
                src="https://www.openstreetmap.org/export/embed.html?bbox=77.55%2C12.92%2C77.65%2C12.99&layer=mapnik&marker=12.9352%2C77.6245"
                loading="lazy"
              ></iframe>
            </div>
          </div>

          {/* Right — contact form */}
          <div className="uc-contact-form-wrap">
            <h3>Send us a message</h3>
            {sent && (
              <div className="alert alert-success">
                <CheckCircle size={16} />
                <span>Thanks! Your message has been received — we'll be in touch soon.</span>
              </div>
            )}
            <form onSubmit={handleSubmit} className="uc-contact-form">
              <div className="form-group">
                <label>Your Name</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Rahul Sharma" required />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="e.g. rahul@gmail.com" required />
              </div>
              <div className="form-group">
                <label>Subject</label>
                <input name="subject" value={form.subject} onChange={handleChange} placeholder="What is this about?" />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea name="message" rows="5" value={form.message} onChange={handleChange} placeholder="Tell us how we can help..." required></textarea>
              </div>
              <button type="submit" className="uc-contact-submit">
                <Send size={16} /> <span>Send Message</span>
              </button>
            </form>

            <div className="uc-contact-booknote">
              Prefer to book directly?{' '}
              <button className="auth-link-btn" onClick={onOpenBooking}>Request a service</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
