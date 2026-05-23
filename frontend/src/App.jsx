import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { apiCall } from './utils/api';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Offers from './components/Offers';
import Services from './components/Services';
import AllServices from './components/AllServices';
import Testimonials from './components/Testimonials';
import Blogs from './components/Blogs';
import Team from './components/Team';
import Contact from './components/Contact';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import BookingModal from './components/BookingModal';
import AdminDashboard from './components/AdminDashboard';
import LocationGate from './components/LocationGate';
import { getSelectedLocation, isServiceable } from './utils/locations';
import { Calendar, MapPin, DollarSign, RefreshCw, AlertCircle } from 'lucide-react';

// Slim banner shown at the top of inner pages.
const PageHead = ({ title, subtitle }) => (
  <section className="uc-page-head">
    <div className="container">
      <h1 className="uc-page-title">{title}</h1>
      {subtitle && <p className="uc-page-subtitle">{subtitle}</p>}
    </div>
  </section>
);

const App = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [currentTab, setCurrentTab] = useState('home'); // 'home' | 'admin' | 'history'
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  
  // User history bookings
  const [myBookings, setMyBookings] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Serviceable-location gating
  const [selectedLocation, setSelectedLocationState] = useState(getSelectedLocation());
  const [locationGateOpen, setLocationGateOpen] = useState(false);
  const locationOk = selectedLocation && isServiceable(selectedLocation);

  // Prompt for a location on first visit if none is set yet.
  useEffect(() => {
    if (!getSelectedLocation()) {
      setLocationGateOpen(true);
    }
  }, []);

  const handleLocationConfirm = (city) => {
    setSelectedLocationState(city);
    setLocationGateOpen(false);
  };

  // Booking is only allowed once a serviceable location is chosen.
  const requireLocation = (proceed) => {
    if (locationOk) {
      proceed();
    } else {
      setLocationGateOpen(true);
    }
  };

  // Auto-redirect admin to dashboard on login / page load
  useEffect(() => {
    if (isAdmin && currentTab !== 'admin') {
      setCurrentTab('admin');
    }
  }, [isAdmin]);

  // Track analytics on page/tab view
  useEffect(() => {
    const trackPage = async () => {
      try {
        const pageId = currentTab === 'home' ? 'home' : currentTab;
        await apiCall('/analytics/track', 'POST', { page: pageId });
      } catch (err) {
        // Non-critical, ignore
      }
    };
    trackPage();
  }, [currentTab]);

  // Dynamic SEO title/meta injection based on tab
  useEffect(() => {
    const updateSEO = async () => {
      try {
        const seoPage = currentTab === 'home' ? 'home' : currentTab;
        const res = await apiCall(`/seo/${seoPage}`);
        if (res.success && res.data) {
          document.title = res.data.title;
          
          const metaDesc = document.querySelector('meta[name="description"]');
          if (metaDesc) {
            metaDesc.setAttribute('content', res.data.description);
          }

          const metaKeys = document.querySelector('meta[name="keywords"]');
          if (metaKeys) {
            metaKeys.setAttribute('content', res.data.keywords);
          }
        }
      } catch (err) {
        // Non-critical
      }
    };
    updateSEO();
  }, [currentTab]);

  // Load user booking history
  const loadMyBookings = async () => {
    if (!isAuthenticated) return;
    setHistoryLoading(true);
    try {
      const res = await apiCall('/bookings');
      if (res.success) {
        setMyBookings(res.data);
      }
    } catch (err) {
      console.error(err);
    }
    setHistoryLoading(false);
  };

  useEffect(() => {
    if (currentTab === 'history') {
      loadMyBookings();
    }
  }, [currentTab, isAuthenticated]);

  const handleSelectServiceAndBook = (service) => {
    requireLocation(() => {
      setSelectedService(service);
      setBookingModalOpen(true);
    });
  };

  const handleQuickBook = () => {
    requireLocation(() => {
      setSelectedService(null);
      setBookingModalOpen(true);
    });
  };

  // When user logs in via the modal, redirect admin to dashboard
  const handleLoginSuccess = (loggedInUser) => {
    if (loggedInUser && loggedInUser.role === 'admin') {
      setCurrentTab('admin');
    }
  };

  // Safe tab change: prevent non-admins from accessing admin panel
  const handleSetCurrentTab = (tab) => {
    if (tab === 'admin' && !isAdmin) return;
    setCurrentTab(tab);
  };

  return (
    <div className="app-wrapper">
      <Header
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenBooking={handleQuickBook}
        setCurrentTab={handleSetCurrentTab}
        currentTab={currentTab}
        isHome={currentTab === 'home'}
        selectedLocation={selectedLocation}
        onOpenLocation={() => setLocationGateOpen(true)}
      />

      {/* RENDER PAGES */}
      <main className="main-content">
        {currentTab === 'home' && (
          <div className="home-sections-flow">
            <Hero onOpenBooking={handleQuickBook} />
            
            <div id="about">
              <About onOpenBooking={handleQuickBook} />
            </div>

            <Offers onOpenBooking={handleQuickBook} />

            <div id="services">
              <Services onSelectService={handleSelectServiceAndBook} />
            </div>

            {/* All admin-managed services with category filter */}
            <AllServices onSelectService={handleSelectServiceAndBook} />

            {/* Team section */}
            <Team />

            <div id="testimonials">
              <Testimonials />
            </div>

            <div id="blog">
              <Blogs />
            </div>
          </div>
        )}

        {/* SERVICES PAGE */}
        {currentTab === 'services' && (
          <div className="inner-page">
            <PageHead title="Our Services" subtitle="Browse and book from our full range of professional cleaning and pest control services." />
            <Services onSelectService={handleSelectServiceAndBook} />
            <AllServices onSelectService={handleSelectServiceAndBook} />
          </div>
        )}

        {/* ABOUT PAGE */}
        {currentTab === 'about' && (
          <div className="inner-page">
            <PageHead title="About Cleannes" subtitle="Trusted, certified and insured home services across India." />
            <About onOpenBooking={handleQuickBook} />
            <Team />
          </div>
        )}

        {/* REVIEWS PAGE */}
        {currentTab === 'reviews' && (
          <div className="inner-page">
            <PageHead title="Customer Reviews" subtitle="See what our customers say — and share your own experience." />
            <Testimonials />
          </div>
        )}

        {/* BLOG PAGE */}
        {currentTab === 'blog' && (
          <div className="inner-page">
            <PageHead title="Cleaning Insights & News" subtitle="Tips, guides and updates from our cleaning experts." />
            <Blogs />
          </div>
        )}

        {/* CONTACT PAGE */}
        {currentTab === 'contact' && (
          <div className="inner-page">
            <PageHead title="Contact Us" subtitle="Get in touch — we're here to help." />
            <Contact onOpenBooking={handleQuickBook} />
          </div>
        )}

        {currentTab === 'admin' && isAdmin && <AdminDashboard />}

        {currentTab === 'admin' && !isAdmin && (
          <section className="history-section">
            <div className="container">
              <div className="empty-history-card">
                <AlertCircle size={48} className="empty-icon" />
                <h3>Access Denied</h3>
                <p>You do not have permission to view the admin dashboard.</p>
                <button className="empty-book-btn" onClick={() => setCurrentTab('home')}>Go Home</button>
              </div>
            </div>
          </section>
        )}

        {currentTab === 'history' && (
          <section className="history-section">
            <div className="container">
              <h2>My Bookings History</h2>
              
              {historyLoading ? (
                <div className="loading-state">Fetching history ledger...</div>
              ) : myBookings.length === 0 ? (
                <div className="empty-history-card">
                  <AlertCircle size={48} className="empty-icon" />
                  <h3>No bookings found</h3>
                  <p>You haven't scheduled any professional cleaning services yet.</p>
                  <button className="empty-book-btn" onClick={handleQuickBook}>Book Your First Cleaning</button>
                </div>
              ) : (
                <div className="history-cards-list">
                  {myBookings.map(b => (
                    <div key={b._id} className="history-item-card">
                      <div className="history-card-header">
                        <div className="header-meta">
                          <span className="order-id">ORDER #{b._id.substring(18)}</span>
                          <span className="order-date">Placed: {new Date(b.createdAt).toLocaleDateString()}</span>
                        </div>
                        <span className={`status-badge stat-${b.status.toLowerCase()}`}>{b.status}</span>
                      </div>

                      <div className="history-card-body">
                        <div className="body-details">
                          <div className="detail-row">
                            <Calendar size={14} className="detail-icon" />
                            <span>Scheduled: <strong>{new Date(b.dateTime).toLocaleString()}</strong></span>
                          </div>
                          <div className="detail-row">
                            <MapPin size={14} className="detail-icon" />
                            <span>Address: {b.address.street}, {b.address.city}</span>
                          </div>
                          <div className="detail-row text-italic">
                            <span>"Rooms: {b.customization.extraRooms}, Balcony: {b.customization.hasBalcony ? 'Yes' : 'No'}"</span>
                          </div>
                        </div>

                        <div className="body-financials">
                          <div className="amount-col">
                            <span className="finance-lbl">Amount Invoiced</span>
                            <span className="finance-val">₹{b.totalAmount.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="status-col">
                            <span className="finance-lbl">Payment Status</span>
                            <span className={`status-badge pay-${b.paymentStatus.toLowerCase()}`}>{b.paymentStatus} ({b.paymentMethod})</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      <Footer setCurrentTab={handleSetCurrentTab} />

      {/* POPUP MODALS */}
      <LoginModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        preselectedService={selectedService}
      />

      <LocationGate
        isOpen={locationGateOpen}
        onClose={() => setLocationGateOpen(false)}
        onConfirm={handleLocationConfirm}
        dismissible={true}
      />
    </div>
  );
};

export default App;
