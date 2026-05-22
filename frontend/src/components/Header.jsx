import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Phone, Mail, MapPin, Search, ShoppingCart, 
  User, LogOut, Lock, LayoutDashboard, ChevronDown
} from 'lucide-react';

const Header = ({
  onOpenAuth,
  onOpenBooking,
  setCurrentTab,
  currentTab,
  isHome,
  selectedLocation,
  onOpenLocation,
}) => {
  const { user, logout, isAdmin } = useAuth();

  const handleNavClick = (tab) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="site-header uc-header">
      {/* Main Navbar (Urban Company style) */}
      <div className="main-nav-bar">
        <div className="container nav-container">
          <div className="logo-area" onClick={() => setCurrentTab('home')}>
            <div className="logo-bubble">C</div>
            <div className="logo-text">
              <span className="logo-main">CLEANNES</span>
              <span className="logo-sub">CLEANING SERVICES</span>
            </div>
          </div>

          {/* Location pill (UC signature element) */}
          <button className="uc-location-pill hide-mobile" onClick={onOpenLocation}>
            <MapPin size={16} />
            <span className="uc-loc-text">{selectedLocation || 'Select location'}</span>
            <ChevronDown size={14} className="inline-icon" />
          </button>

          <nav className="nav-menu uc-nav-menu">
            <button
              className={`nav-link-btn ${currentTab === 'home' ? 'active' : ''}`}
              onClick={() => handleNavClick('home')}
            >
              Home
            </button>
            <button
              className={`nav-link-btn ${currentTab === 'services' ? 'active' : ''}`}
              onClick={() => handleNavClick('services')}
            >
              Services
            </button>
            <button
              className={`nav-link-btn ${currentTab === 'about' ? 'active' : ''}`}
              onClick={() => handleNavClick('about')}
            >
              About
            </button>
            <button
              className={`nav-link-btn ${currentTab === 'reviews' ? 'active' : ''}`}
              onClick={() => handleNavClick('reviews')}
            >
              Reviews
            </button>
            <button
              className={`nav-link-btn ${currentTab === 'blog' ? 'active' : ''}`}
              onClick={() => handleNavClick('blog')}
            >
              Blog
            </button>
            <button
              className={`nav-link-btn ${currentTab === 'contact' ? 'active' : ''}`}
              onClick={() => handleNavClick('contact')}
            >
              Contact
            </button>
          </nav>

          <div className="nav-actions uc-nav-actions">
            <button className="nav-action-icon" aria-label="Search" onClick={onOpenBooking}>
              <Search size={20} />
            </button>
            <button className="nav-action-icon" aria-label="Cart" onClick={onOpenBooking}>
              <ShoppingCart size={20} />
            </button>

            {user ? (
              <div className="user-nav-profile">
                {isAdmin ? (
                  <button
                    className={`nav-admin-badge ${currentTab === 'admin' ? 'active' : ''}`}
                    onClick={() => setCurrentTab('admin')}
                    title="Go to Admin Panel"
                  >
                    <LayoutDashboard size={14} />
                    <span>Admin</span>
                  </button>
                ) : (
                  <button
                    className="nav-user-badge"
                    onClick={() => setCurrentTab('history')}
                    title="View My Bookings"
                  >
                    <User size={14} />
                    <span>{user.name.split(' ')[0]}</span>
                  </button>
                )}
                <button className="logout-btn" onClick={logout} title="Sign Out">
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button className="login-trigger-btn" onClick={onOpenAuth}>
                <User size={16} />
                <span>Login</span>
              </button>
            )}

            <button className="get-quote-btn uc-book-btn" onClick={onOpenBooking}>
              Book now
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
