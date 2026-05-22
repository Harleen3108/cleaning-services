import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  X, MapPin, Search, Navigation, Clock, Frown, Plus, Trash2, Settings,
} from 'lucide-react';
import {
  getServiceableLocations,
  addServiceableLocation,
  removeServiceableLocation,
  isDefaultLocation,
  matchServiceable,
  setSelectedLocation,
} from '../utils/locations';

const LocationGate = ({ isOpen, onClose, onConfirm, dismissible = true }) => {
  const { isAdmin } = useAuth();
  const [query, setQuery] = useState('');
  const [locations, setLocations] = useState([]);
  const [view, setView] = useState('search'); // 'search' | 'unavailable'
  const [rejectedCity, setRejectedCity] = useState('');
  const [locating, setLocating] = useState(false);
  const [showManage, setShowManage] = useState(false);
  const [newCity, setNewCity] = useState('');

  useEffect(() => {
    if (isOpen) {
      setLocations(getServiceableLocations());
      setView('search');
      setQuery('');
      setRejectedCity('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const confirmCity = (city) => {
    setSelectedLocation(city);
    onConfirm(city, true);
  };

  // User typed something and pressed Enter / "search" — decide serviceability.
  const handleFreeSubmit = (text) => {
    const value = (text ?? query).trim();
    if (!value) return;
    const matched = matchServiceable(value);
    if (matched) {
      confirmCity(matched);
    } else {
      setRejectedCity(value);
      setView('unavailable');
    }
  };

  const handleUseCurrent = () => {
    if (!navigator.geolocation) {
      handleFreeSubmit();
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          const display = data?.display_name || '';
          const matched = matchServiceable(display);
          if (matched) {
            confirmCity(matched);
          } else {
            const addr = data?.address || {};
            setRejectedCity(addr.city || addr.town || addr.state_district || addr.state || 'your area');
            setView('unavailable');
          }
        } catch {
          setView('unavailable');
          setRejectedCity('your area');
        }
        setLocating(false);
      },
      () => {
        setLocating(false);
      }
    );
  };

  const handleAdd = () => {
    if (!newCity.trim()) return;
    setLocations(addServiceableLocation(newCity));
    setNewCity('');
  };

  const handleRemove = (city) => {
    setLocations(removeServiceableLocation(city));
  };

  const filtered = query.trim()
    ? locations.filter((c) => c.toLowerCase().includes(query.trim().toLowerCase()))
    : locations;

  return (
    <div className="modal-overlay">
      <div className="modal-content uc-location-modal animate-scale-in">
        {dismissible && (
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        )}

        {view === 'search' && (
          <>
            <div className="uc-locgate-head">
              <MapPin size={22} className="uc-locgate-pin" />
              <h2>Where do you need the service?</h2>
              <p>Select your city so we can show what's available near you.</p>
            </div>

            <div className="uc-locgate-searchbar">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search for your city / area"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleFreeSubmit(); }}
                autoFocus
              />
            </div>

            <button className="uc-locgate-current" onClick={handleUseCurrent} disabled={locating}>
              <Navigation size={16} />
              <span>{locating ? 'Detecting your location…' : 'Use current location'}</span>
            </button>

            <div className="uc-locgate-divider" />

            <div className="uc-locgate-list-label">
              <Clock size={14} /> Available cities
            </div>
            <ul className="uc-locgate-list">
              {filtered.length === 0 ? (
                <li className="uc-locgate-empty">
                  No match. Press Enter to check “{query}”.
                </li>
              ) : (
                filtered.map((city) => (
                  <li key={city} onClick={() => confirmCity(city)}>
                    <MapPin size={16} className="uc-locgate-listpin" />
                    <span>{city}</span>
                  </li>
                ))
              )}
            </ul>

            {isAdmin && (
              <div className="uc-locgate-admin">
                <button className="uc-locgate-managetoggle" onClick={() => setShowManage((s) => !s)}>
                  <Settings size={14} /> {showManage ? 'Hide' : 'Manage'} serviceable areas (admin)
                </button>
                {showManage && (
                  <div className="uc-locgate-manage">
                    <div className="uc-locgate-addrow">
                      <input
                        type="text"
                        placeholder="Add a city name…"
                        value={newCity}
                        onChange={(e) => setNewCity(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }}
                      />
                      <button onClick={handleAdd}><Plus size={16} /> Add</button>
                    </div>
                    <div className="uc-locgate-chips">
                      {locations.map((city) => (
                        <span key={city} className={`uc-locgate-chip ${isDefaultLocation(city) ? 'is-default' : ''}`}>
                          {city}
                          {!isDefaultLocation(city) && (
                            <button onClick={() => handleRemove(city)} title="Remove">
                              <Trash2 size={12} />
                            </button>
                          )}
                        </span>
                      ))}
                    </div>
                    <p className="uc-locgate-managenote">Default cities can't be removed. Added cities are saved in this browser.</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {view === 'unavailable' && (
          <div className="uc-locgate-unavailable">
            <Frown size={56} className="uc-locgate-frown" />
            <h2>Services are not available in {rejectedCity}</h2>
            <p>Please choose another location to explore our services.</p>
            <div className="uc-locgate-unavail-actions">
              <button className="uc-locgate-back" onClick={() => { setView('search'); setQuery(''); }}>
                Choose another location
              </button>
              {dismissible && (
                <button className="uc-locgate-home" onClick={onClose}>
                  Go to homepage
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationGate;
