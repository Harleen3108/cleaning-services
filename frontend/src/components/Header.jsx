import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Phone, Mail, MapPin, Search, ShoppingCart,
  User, LogOut, Lock, LayoutDashboard, ChevronDown,
  Menu, X
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab) => {
    setCurrentTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMobileBooking = () => {
    setMobileMenuOpen(false);
    onOpenBooking();
  };

  const handleMobileAuth = () => {
    setMobileMenuOpen(false);
    onOpenAuth();
  };

  return (
    <header className="site-header uc-header">
      <div className="main-nav-bar">
        <div className="container nav-container">

          <div className="logo-area" onClick={() => handleNavClick("home")}>
            <div className="logo-bubble">C</div>
            <div className="logo-text">
              <span className="logo-main">CLEANNES</span>
              <span className="logo-sub">CLEANING SERVICES</span>
            </div>
          </div>

          <button className="uc-location-pill hide-mobile" onClick={onOpenLocation}>
            <MapPin size={16} />
            <span className="uc-loc-text">{selectedLocation || "Select location"}</span>
            <ChevronDown size={14} className="inline-icon" />
          </button>

          <nav className="nav-menu uc-nav-menu desktop-nav">
            {["home", "services", "about", "reviews", "blog", "contact"].map(tab => (
              <button
                key={tab}
                className={"nav-link-btn " + (currentTab === tab ? "active" : "")}
                onClick={() => handleNavClick(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>

          <div className="nav-actions uc-nav-actions desktop-nav">
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
                    className={"nav-admin-badge " + (currentTab === "admin" ? "active" : "")}
                    onClick={() => setCurrentTab("admin")}
                    title="Go to Admin Panel"
                  >
                    <LayoutDashboard size={14} />
                    <span>Admin</span>
                  </button>
                ) : (
                  <button
                    className="nav-user-badge"
                    onClick={() => setCurrentTab("history")}
                    title="View My Bookings"
                  >
                    <User size={14} />
                    <span>{user.name.split(" ")[0]}</span>
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

          <div className="mobile-nav-right">
            <button className="get-quote-btn uc-book-btn mobile-book-btn" onClick={handleMobileBooking}>
              Book
            </button>
            <button
              className="hamburger-btn"
              onClick={() => setMobileMenuOpen(function(o) { return !o; })}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)} />
      )}

      <div className={"mobile-drawer " + (mobileMenuOpen ? "mobile-drawer-open" : "")}>

        <button
          className="mobile-location-row"
          onClick={() => { setMobileMenuOpen(false); onOpenLocation(); }}
        >
          <MapPin size={16} />
          <span>{selectedLocation || "Select location"}</span>
          <ChevronDown size={14} style={{ marginLeft: "auto" }} />
        </button>

        <nav className="mobile-nav-links">
          {["home", "services", "about", "reviews", "blog", "contact"].map(tab => (
            <button
              key={tab}
              className={"mobile-nav-link " + (currentTab === tab ? "active" : "")}
              onClick={() => handleNavClick(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>

        <div className="mobile-drawer-auth">
          {user ? (
            <div className="mobile-user-row">
              <div className="mobile-user-info">
                <User size={18} />
                <span>{user.name}</span>
              </div>
              {isAdmin ? (
                <button className="mobile-admin-btn" onClick={() => handleNavClick("admin")}>
                  <LayoutDashboard size={15} /> Admin Panel
                </button>
              ) : (
                <button className="mobile-admin-btn" onClick={() => handleNavClick("history")}>
                  <ShoppingCart size={15} /> My Bookings
                </button>
              )}
              <button
                className="mobile-logout-btn"
                onClick={() => { logout(); setMobileMenuOpen(false); }}
              >
                <LogOut size={15} /> Sign Out
              </button>
            </div>
          ) : (
            <button className="mobile-login-btn" onClick={handleMobileAuth}>
              <User size={16} /> Login / Register
            </button>
          )}
        </div>

        <button className="mobile-drawer-book-btn" onClick={handleMobileBooking}>
          Book a Service
        </button>

      </div>
    </header>
  );
};

export default Header;
