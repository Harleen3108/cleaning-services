import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { apiCall } from '../utils/api';

const About = ({ onOpenBooking }) => {
  const [cmsData, setCmsData] = useState({
    badge: 'ABOUT US',
    title: 'Let Us Handle the Mess\nYou Enjoy the Clean',
    description: 'Deep cleaning services go beyond regular maintenance cleaning to tackle areas that are often overlooked, such as baseboards, behind appliances, inside cabinets, and other hard-to-reach spaces.',
    features: [
      "We Don't Cut Corners, We Clean Them",
      'Bringing Freshness to Your Doorstep',
      'Where Cleanliness Meets Perfection'
    ],
    experienceYears: '12+'
  });

  useEffect(() => {
    const fetchCMS = async () => {
      try {
        const res = await apiCall('/cms/about');
        if (res.success && res.data) {
          setCmsData(prev => ({ ...prev, ...res.data }));
        }
      } catch (err) {
        // Silently use defaults
      }
    };
    fetchCMS();
  }, []);

  const features = Array.isArray(cmsData.features) ? cmsData.features : [
    "We Don't Cut Corners, We Clean Them",
    'Bringing Freshness to Your Doorstep',
    'Where Cleanliness Meets Perfection'
  ];

  return (
    <section className="about-section" id="about">
      <div className="container about-container">
        {/* Left Side: Circular Image Montage */}
        <div className="about-image-montage">
          <div className="circle-image-container img-primary">
            <img 
              src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=350&auto=format&fit=crop" 
              alt="Cleaning window" 
            />
          </div>
          <div className="circle-image-container img-secondary">
            <img 
              src="https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?q=80&w=300&auto=format&fit=crop" 
              alt="Vacuuming carpet" 
            />
          </div>
          <div className="circle-image-container img-tertiary">
            <img 
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=250&auto=format&fit=crop" 
              alt="Cleaning surfaces" 
            />
          </div>
          <div className="circle-image-decor"></div>
        </div>

        {/* Right Side: Text Information */}
        <div className="about-content">
          <span className="section-label">{cmsData.badge || 'ABOUT US'}</span>
          <h2 className="section-title">
            {cmsData.title.split('\n').map((line, i, arr) => (
              <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
            ))}
          </h2>
          <p className="about-desc">{cmsData.description}</p>

          <ul className="about-features-list">
            {features.map((feat, idx) => (
              <li key={idx} className="about-feature-item">
                <CheckCircle size={18} className="feature-check" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>

          <div className="about-founder-block">
            <button className="about-readmore-btn" onClick={onOpenBooking}>
              READ MORE &gt;
            </button>
            <div className="founder-info">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&auto=format&fit=crop" 
                alt="Brooklyn Simmons" 
                className="founder-photo"
              />
              <div className="founder-details">
                <h4 className="founder-name">Brooklyn Simmons</h4>
                <p className="founder-title">Co-Founder</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
