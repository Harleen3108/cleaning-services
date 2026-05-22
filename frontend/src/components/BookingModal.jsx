import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiCall } from '../utils/api';
import { X, Calendar, MapPin, Sliders, CheckCircle, Search, HelpCircle, Navigation } from 'lucide-react';

const BookingModal = ({ isOpen, onClose, preselectedService }) => {
  const { isAuthenticated, user } = useAuth();
  
  // Navigation steps: 'details' -> 'confirm' -> 'success'
  const [step, setStep] = useState('details');
  const [services, setServices] = useState([]);
  
  // Form fields
  const [selectedService, setSelectedService] = useState(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('09:00');
  
  // Contact details
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');

  // Location search and Leaflet coordinates
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [latitude, setLatitude] = useState(12.9716); // Default Bangalore Lat
  const [longitude, setLongitude] = useState(77.5946); // Default Bangalore Lng
  const [formattedAddress, setFormattedAddress] = useState('');
  const [searching, setSearching] = useState(false);

  // Customizations
  const [extraRooms, setExtraRooms] = useState(0);
  const [hasBalcony, setHasBalcony] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [createdBooking, setCreatedBooking] = useState(null);

  // Leaflet references
  const mapContainerRef = useRef(null);
  const leafletMap = useRef(null);
  const mapMarker = useRef(null);

  // Fetch Services & prefill user details
  useEffect(() => {
    if (isOpen) {
      setStep('details');
      setErrorMsg('');
      
      if (user) {
        setName(user.name || '');
        setEmail(user.email || '');
        setPhone(user.phone || '');
      } else {
        setName('');
        setEmail('');
        setPhone('');
      }
      
      const fetchServices = async () => {
        try {
          const res = await apiCall('/services');
          if (res.success) {
            const activeSvcs = res.data.filter(s => s.isActive !== false);
            setServices(activeSvcs);
            if (preselectedService && preselectedService.isActive !== false) {
              setSelectedService(preselectedService);
            } else {
              setSelectedService(null);
            }
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchServices();
    }
  }, [isOpen, preselectedService, user]);

  // Handle OSM Nominatim Autocomplete Searches
  useEffect(() => {
    if (searchQuery.trim().length < 3) {
      setSuggestions([]);
      return;
    }
    const delayDebounce = setTimeout(async () => {
      setSearching(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5&countrycodes=in`
        );
        const data = await response.json();
        setSuggestions(data);
      } catch (err) {
        console.error('Error fetching Nominatim geocoding:', err);
      }
      setSearching(false);
    }, 600);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Leaflet Map Initialization
  useEffect(() => {
    if (step === 'details' && isOpen && mapContainerRef.current) {
      // Small timeout to let the DOM container render completely
      const initTimer = setTimeout(() => {
        if (!leafletMap.current && window.L) {
          // Initialize map instance
          leafletMap.current = window.L.map(mapContainerRef.current).setView([latitude, longitude], 13);
          
          // Load tiles from OpenStreetMap
          window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(leafletMap.current);

          // Add draggable marker
          mapMarker.current = window.L.marker([latitude, longitude], {
            draggable: true
          }).addTo(leafletMap.current);

          // Listen to marker drag events to reverse-geocode
          mapMarker.current.on('dragend', async (event) => {
            const position = event.target.getLatLng();
            setLatitude(position.lat);
            setLongitude(position.lng);
            await reverseGeocode(position.lat, position.lng);
          });

          // Listen to click on map to move marker
          leafletMap.current.on('click', async (event) => {
            const position = event.latlng;
            setLatitude(position.lat);
            setLongitude(position.lng);
            if (mapMarker.current) {
              mapMarker.current.setLatLng(position);
            }
            await reverseGeocode(position.lat, position.lng);
          });
        }
      }, 300);

      return () => {
        clearTimeout(initTimer);
        if (leafletMap.current) {
          leafletMap.current.remove();
          leafletMap.current = null;
          mapMarker.current = null;
        }
      };
    }
  }, [step, isOpen]);

  // Reverse Geocoding via Nominatim
  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      if (data && data.display_name) {
        setFormattedAddress(data.display_name);
        setSearchQuery(data.display_name);
      }
    } catch (err) {
      console.error('Error reverse geocoding:', err);
    }
  };

  // Handle Location Suggestion Selection
  const handleSelectSuggestion = (place) => {
    const lat = parseFloat(place.lat);
    const lon = parseFloat(place.lon);
    
    setLatitude(lat);
    setLongitude(lon);
    setFormattedAddress(place.display_name);
    setSearchQuery(place.display_name);
    setSuggestions([]);

    if (leafletMap.current) {
      leafletMap.current.setView([lat, lon], 15);
    }
    if (mapMarker.current) {
      mapMarker.current.setLatLng([lat, lon]);
    }
  };

  // On Enter / Search button press — fly to first suggestion automatically
  const handleSearchSubmit = async () => {
    if (searchQuery.trim().length < 3) return;
    setSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5&countrycodes=in`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        handleSelectSuggestion(data[0]);
      }
    } catch (err) {
      console.error('Search error:', err);
    }
    setSearching(false);
  };

  // Form step calculations
  const minBasePrice = selectedService ? (selectedService.minPrice || selectedService.price || 299) : 299;
  const maxBasePrice = selectedService ? (selectedService.maxPrice || Math.round(minBasePrice * 1.5) || 499) : 499;

  const extraCost = (extraRooms * 500) + (hasBalcony ? 350 : 0);
  const minTotal = minBasePrice + extraCost;
  const maxTotal = maxBasePrice + extraCost;

  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!selectedService) {
      setErrorMsg('Please select a service from the list');
      return;
    }
    if (!date) {
      setErrorMsg('Please choose a preferred schedule date');
      return;
    }
    if (!name || !email || !phone || !description) {
      setErrorMsg('Please fill in your contact information and requirements');
      return;
    }
    if (!formattedAddress || !latitude || !longitude) {
      setErrorMsg('Please select your location from the map or map suggestions');
      return;
    }

    setStep('confirm');
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const bookingData = {
        serviceId: selectedService._id,
        dateTime: new Date(`${date}T${time}`),
        name,
        email,
        phone,
        description,
        latitude,
        longitude,
        formattedAddress,
        customization: { extraRooms, hasBalcony }
      };

      const res = await apiCall('/bookings', 'POST', bookingData);
      if (res.success) {
        setCreatedBooking(res.data);
        setStep('success');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Service request submission failed');
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content booking-modal-box animate-scale-in">
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Modal Progress Tracker */}
        {step !== 'success' && (
          <div className="booking-progress-tracker">
            <span className={step === 'details' ? 'active-step' : ''}>1. Request Details</span>
            <span className="step-arrow">&gt;</span>
            <span className={step === 'confirm' ? 'active-step' : ''}>2. Review & Submit</span>
          </div>
        )}

        {/* STEP 1: Details and Leaflet Map */}
        {step === 'details' && (
          <form onSubmit={handleDetailsSubmit} className="booking-form-wizard">
            <h2>Request Professional Service</h2>
            <p className="wizard-subtitle text-muted">Complete details and schedule. Estimate pricing will apply offline.</p>
            {errorMsg && <div className="alert alert-error">{errorMsg}</div>}

            <div className="form-grid-2">
              <div className="form-group">
                <label>Select Cleaning Service</label>
                <select
                  className={`form-select ${!selectedService ? 'select-placeholder' : ''}`}
                  value={selectedService ? selectedService._id : ''}
                  onChange={(e) => {
                    const serv = services.find(s => s._id === e.target.value);
                    setSelectedService(serv || null);
                  }}
                >
                  <option value="" disabled>Select Service</option>
                  {services.map(s => (
                    <option key={s._id} value={s._id}>
                      {s.name} (₹{s.minPrice || s.price} - ₹{s.maxPrice || Math.round((s.minPrice || s.price) * 1.5)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group-row">
                <div className="form-group w-50">
                  <label>Service Date</label>
                  <input 
                    type="date" 
                    className="form-input" 
                    value={date} 
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group w-50">
                  <label>Preferred Time</label>
                  <select 
                    className="form-select" 
                    value={time} 
                    onChange={(e) => setTime(e.target.value)}
                  >
                    <option value="08:00">08:00 AM</option>
                    <option value="09:00">09:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="13:00">01:00 PM</option>
                    <option value="15:00">03:00 PM</option>
                    <option value="17:00">05:00 PM</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-divider-line">Contact & Requirements</div>
            <div className="form-grid-2">
              <div className="form-group">
                <label>Your Full Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Rahul Sharma"
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group-row">
                <div className="form-group w-50">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    placeholder="e.g. rahul@gmail.com"
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group w-50">
                  <label>Phone Number</label>
                  <input 
                    type="tel" 
                    className="form-input" 
                    placeholder="e.g. 9876543210"
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Service Description & Custom Requirements</label>
              <textarea 
                className="form-textarea" 
                placeholder="Describe what tasks you need done (e.g., Deep clean kitchen cabinets, clean master balcony, remove stains from carpet)..."
                rows="2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="form-divider-line">Interactive Map Location</div>
            
            <div className="form-group position-relative">
              <label>Search & Select Address</label>
              <div className="input-search-wrapper">
                <Search size={16} className="search-icon-inside" />
                <input 
                  type="text"
                  className="form-input search-address-input"
                  placeholder="Type your area e.g. Koramangala Bengaluru..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSearchSubmit(); } }}
                />
                <button
                  type="button"
                  className="map-search-btn"
                  onClick={handleSearchSubmit}
                  disabled={searching}
                >
                  {searching ? '...' : 'Go'}
                </button>
              </div>

              {suggestions.length > 0 && (
                <ul className="address-suggestions-dropdown">
                  {suggestions.map((place, idx) => (
                    <li key={idx} onClick={() => handleSelectSuggestion(place)}>
                      <MapPin size={14} className="suggest-pin" />
                      <span>{place.display_name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="map-leaflet-wrapper">
              <div ref={mapContainerRef} className="booking-leaflet-container"></div>
              <span className="map-instruction-label">
                <Navigation size={12} /> Type & press Go to search, or drag/click the map to pin exact spot
              </span>
            </div>

            <div className="form-divider-line">Customize & Extras</div>
            <div className="form-grid-customs">
              <div className="custom-item-card">
                <div className="custom-card-label">
                  <strong>Extra Rooms</strong>
                  <span>+₹500 per room estimate</span>
                </div>
                <div className="number-counter">
                  <button 
                    type="button" 
                    onClick={() => setExtraRooms(Math.max(0, extraRooms - 1))}
                  >-</button>
                  <span>{extraRooms}</span>
                  <button 
                    type="button" 
                    onClick={() => setExtraRooms(extraRooms + 1)}
                  >+</button>
                </div>
              </div>

              <div className="custom-item-card">
                <div className="custom-card-label">
                  <strong>Balcony Cleaning</strong>
                  <span>+₹350 additional estimate</span>
                </div>
                <input 
                  type="checkbox" 
                  className="custom-checkbox"
                  checked={hasBalcony} 
                  onChange={(e) => setHasBalcony(e.target.checked)} 
                />
              </div>
            </div>

            <button type="submit" className="booking-next-btn">
              <span>REVIEW SERVICE REQUEST</span>
            </button>
          </form>
        )}

        {/* STEP 2: Review & Submit */}
        {step === 'confirm' && (
          <form onSubmit={handleBookingSubmit} className="booking-payment-wizard">
            <h2>Review Service Booking</h2>
            <p className="wizard-subtitle text-muted">Please confirm your request details before submitting to the administrator.</p>
            {errorMsg && <div className="alert alert-error">{errorMsg}</div>}

            <div className="review-details-summary">
              <div className="summary-section">
                <h3>Contact & Schedule</h3>
                <p><strong>Name:</strong> {name}</p>
                <p><strong>Email:</strong> {email}</p>
                <p><strong>Phone:</strong> {phone}</p>
                <p><strong>Scheduled:</strong> {date} at {time}</p>
              </div>

              <div className="summary-section mt-3">
                <h3>Location Address</h3>
                <p className="address-text-bold"><MapPin size={14} className="inline-icon" /> {formattedAddress}</p>
                <span className="coords-lbl">Coordinates: {latitude.toFixed(6)}, {longitude.toFixed(6)}</span>
              </div>

              <div className="summary-section mt-3">
                <h3>Description</h3>
                <p className="desc-box">{description}</p>
              </div>
            </div>

            <div className="payment-invoice-summary mt-4">
              <h3>Estimated Amount Range</h3>
              <div className="invoice-row">
                <span>{selectedService?.name} (Base Range)</span>
                <span>₹{minBasePrice.toLocaleString('en-IN')} - ₹{maxBasePrice.toLocaleString('en-IN')}</span>
              </div>
              {extraCost > 0 && (
                <div className="invoice-row text-secondary">
                  <span>Customization Extras (Rooms & Balcony)</span>
                  <span>+₹{extraCost.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="invoice-row invoice-total">
                <span>Total Est. Budget Range</span>
                <span>₹{minTotal.toLocaleString('en-IN')} - ₹{maxTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="no-online-gateways-notice">
                <HelpCircle size={14} className="info-icon" />
                <span>No online payment needed now. Pay locally after admin approval and job completion.</span>
              </div>
            </div>

            <div className="payment-action-buttons">
              <button type="button" className="payment-back-btn" onClick={() => setStep('details')}>
                &larr; Edit Details
              </button>
              <button type="submit" className="payment-submit-btn" disabled={loading}>
                {loading ? 'Submitting Request...' : 'SUBMIT SERVICE REQUEST'}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Success Screen */}
        {step === 'success' && (
          <div className="booking-success-container animate-scale-in">
            <CheckCircle size={64} className="success-icon" />
            <h2>Service Request Submitted!</h2>
            <p>Your request is pending administrative approval. You will receive an email and a WhatsApp notification upon review.</p>

            {createdBooking && (
              <div className="success-receipt-details">
                <div className="receipt-row">
                  <span>Request ID:</span>
                  <span>{createdBooking._id}</span>
                </div>
                <div className="receipt-row">
                  <span>Service Requested:</span>
                  <span>{selectedService?.name}</span>
                </div>
                <div className="receipt-row">
                  <span>Scheduled Date:</span>
                  <span>{new Date(createdBooking.dateTime).toLocaleString('en-IN')}</span>
                </div>
                <div className="receipt-row">
                  <span>Status:</span>
                  <span className="badge-pending-status">{createdBooking.status}</span>
                </div>
                <div className="receipt-row font-bold">
                  <span>Estimated Surcharge:</span>
                  <strong>₹{minTotal.toLocaleString('en-IN')} - ₹{maxTotal.toLocaleString('en-IN')}</strong>
                </div>
              </div>
            )}

            <button className="success-close-btn" onClick={onClose}>
              Return to Homepage
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
