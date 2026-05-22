import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import { apiCall } from '../utils/api';

const Footer = ({ setCurrentTab }) => {
  const [cmsData, setCmsData] = useState({
    description: 'Cleannes offers premium eco-friendly cleaning solutions for residential, commercial, and villa spaces across India. Certified, insured, and trusted.',
    copyright: `© ${new Date().getFullYear()} Cleannes Services India Pvt. Ltd. All Rights Reserved.`,
    address: 'Koramangala, Bengaluru, Karnataka 560034',
    phone: '+91 98765 43210',
    email: 'support@cleannes.in'
  });

  useEffect(() => {
    const fetchCMS = async () => {
      try {
        const res = await apiCall('/cms/footer');
        if (res.success && res.data) {
          setCmsData(prev => ({ ...prev, ...res.data }));
        }
      } catch (err) {
        // Silently use defaults
      }
    };
    fetchCMS();
  }, []);

  const goTo = (tab) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="site-footer" id="contact">
      <div className="container footer-container">
        {/* Col 1: About */}
        <div className="footer-col footer-col-about">
          <div className="footer-logo">
            <div className="logo-bubble">C</div>
            <div className="logo-text">
              <span className="logo-main text-white">CLEANNES</span>
              <span className="logo-sub text-blue">CLEANING SERVICES</span>
            </div>
          </div>
          <p className="footer-about-text">{cmsData.description}</p>
          <div className="footer-socials">
            <a href="#" className="footer-social-link">f</a>
            <a href="#" className="footer-social-link">t</a>
            <a href="#" className="footer-social-link">in</a>
            <a href="#" className="footer-social-link">y</a>
          </div>
        </div>

        {/* Col 2: Navigation Links */}
        <div className="footer-col">
          <h3 className="footer-title">Quick Links</h3>
          <ul className="footer-links-list">
            <li><button onClick={() => goTo('home')}>Home Page</button></li>
            <li><button onClick={() => goTo('services')}>Services</button></li>
            <li><button onClick={() => goTo('about')}>About Company</button></li>
            <li><button onClick={() => goTo('reviews')}>Customer Reviews</button></li>
            <li><button onClick={() => goTo('blog')}>News &amp; Articles</button></li>
          </ul>
        </div>

        {/* Col 3: Services List */}
        <div className="footer-col">
          <h3 className="footer-title">Our Services</h3>
          <ul className="footer-links-list">
            <li><button onClick={() => goTo('services')}>Regular Domestic Cleaning</button></li>
            <li><button onClick={() => goTo('services')}>Carpet &amp; Sofa Sanitizing</button></li>
            <li><button onClick={() => goTo('services')}>Office Deep Clean</button></li>
            <li><button onClick={() => goTo('services')}>Villa Window Washing</button></li>
            <li><button onClick={() => goTo('services')}>Pest Bedbug Treatment</button></li>
          </ul>
        </div>

        {/* Col 4: Contact & Newsletter */}
        <div className="footer-col footer-col-contact">
          <h3 className="footer-title">Contact Info</h3>
          <ul className="footer-contact-list">
            <li>
              <Phone size={14} className="footer-contact-icon" />
              <a href={`tel:${cmsData.phone?.replace(/\D/g, '')}`}>{cmsData.phone}</a>
            </li>
            <li>
              <Mail size={14} className="footer-contact-icon" />
              <a href={`mailto:${cmsData.email}`}>{cmsData.email}</a>
            </li>
            <li>
              <MapPin size={14} className="footer-contact-icon" />
              <span>{cmsData.address}</span>
            </li>
          </ul>

          <div className="newsletter-box">
            <h4 className="newsletter-title">Subscribe to Newsletter</h4>
            <div className="newsletter-form">
              <input type="email" placeholder="Your email address" className="newsletter-input" />
              <button className="newsletter-submit-btn" aria-label="Subscribe">
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-container">
          <p className="copyright-text">{cmsData.copyright}</p>
          <p className="design-attribution">Designed by Professional UI Expert Teams.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
