import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LoginPage from './components/LoginPage';
import VenueCard from './components/VenueCard';
import CourtSelector from './components/CourtSelector';
import SlotPicker from './components/SlotPicker';
import BookingConfirmationModal from './components/BookingConfirmationModal';
import ConfirmationScreen from './components/ConfirmationScreen';
import MyBookings from './components/MyBookings';
import { api } from './api/client';
import { useAuth } from './context/AuthContext';
import { Navigation, MapPin, ArrowRight, Shield, Zap } from 'lucide-react';

const TEST_LOCATIONS = [
  { name: 'Bangalore Center', lat: 12.9716, lng: 77.5946 },
  { name: 'Indiranagar (Near Smash Arena)', lat: 12.978, lng: 77.601 },
  { name: 'Koramangala (Near Apex Hub)', lat: 12.9352, lng: 77.6245 },
  { name: 'Malleshwaram (Near Rally Point)', lat: 12.99, lng: 77.57 },
];

export default function App() {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('venues'); // 'venues' | 'my-bookings'
  const [userLocation, setUserLocation] = useState(TEST_LOCATIONS[0]);
  const [isLocating, setIsLocating] = useState(false);

  // Venues & Court Selection state
  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [courts, setCourts] = useState([]);
  const [selectedCourt, setSelectedCourt] = useState(null);

  // Date & Slot state
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Modals & Confirmation
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmedBookingData, setConfirmedBookingData] = useState(null);

  // Load Venues sorted by location
  const loadVenues = async (lat, lng) => {
    try {
      const data = await api.getVenues(lat, lng);
      if (data.success) {
        setVenues(data.venues);
        if (data.venues.length > 0) {
          handleSelectVenue(data.venues[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching venues:', err);
    }
  };

  useEffect(() => {
    if (user) {
      loadVenues(userLocation.lat, userLocation.lng);
    }
  }, [user]);

  const handleDetectLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLoc = {
            name: 'Detected Location',
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(newLoc);
          loadVenues(newLoc.lat, newLoc.lng);
          setIsLocating(false);
        },
        (error) => {
          console.warn('Geolocation error or denied. Using test location fallback.', error);
          setIsLocating(false);
        },
        { timeout: 5000 }
      );
    } else {
      setIsLocating(false);
    }
  };

  const handleSelectLocation = (loc) => {
    setUserLocation(loc);
    loadVenues(loc.lat, loc.lng);
  };

  const handleSelectVenue = async (venue) => {
    setSelectedVenue(venue);
    setSelectedCourt(null);
    setSelectedSlot(null);

    try {
      const data = await api.getCourts(venue.id);
      if (data.success) {
        setCourts(data.courts);
        if (data.courts.length > 0) {
          setSelectedCourt(data.courts[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching courts:', err);
    }
  };

  const handleBookingSuccess = (bookingRecord) => {
    setIsConfirmModalOpen(false);
    setConfirmedBookingData({
      booking: bookingRecord,
      venue: selectedVenue,
      court: selectedCourt,
      slot: selectedSlot,
    });
  };

  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: '#94a3b8' }}>
        Loading ShuttleSpot...
      </div>
    );
  }

  // 1. If User is NOT Logged In -> Render Dedicated Login Page
  if (!user) {
    return <LoginPage />;
  }

  // 2. If User IS Logged In -> Render Full Booking Dashboard
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setConfirmedBookingData(null);
        }}
        userLocation={userLocation}
        onRequestLocation={handleDetectLocation}
      />

      <main style={{ flex: 1, maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '32px 24px' }}>
        {confirmedBookingData ? (
          <ConfirmationScreen
            booking={confirmedBookingData.booking}
            venue={confirmedBookingData.venue}
            court={confirmedBookingData.court}
            slot={confirmedBookingData.slot}
            onViewBookings={() => {
              setConfirmedBookingData(null);
              setActiveTab('my-bookings');
            }}
            onBookNew={() => {
              setConfirmedBookingData(null);
              setSelectedSlot(null);
              setActiveTab('venues');
            }}
          />
        ) : activeTab === 'my-bookings' ? (
          <MyBookings
            onBookNew={() => {
              setActiveTab('venues');
              setSelectedSlot(null);
            }}
          />
        ) : (
          <div>
            {/* Banner & Location Bar */}
            <div className="glass-panel" style={{ padding: '28px', marginBottom: '32px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)', borderRadius: '50%' }}></div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', marginBottom: '6px' }}>
                    Welcome back, {user.name}!
                  </h2>
                  <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
                    Select a court, pick your 30-min time slot, and reserve instantly.
                  </p>
                </div>

                {/* Location Quick Switcher */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(15, 23, 42, 0.6)', padding: '8px 14px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <Navigation size={16} color="#06b6d4" />
                  <span style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600 }}>Test Location:</span>
                  <select
                    value={userLocation.name}
                    onChange={(e) => {
                      const found = TEST_LOCATIONS.find((loc) => loc.name === e.target.value);
                      if (found) handleSelectLocation(found);
                    }}
                    style={{ background: 'transparent', border: 'none', color: '#06b6d4', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', outline: 'none' }}
                  >
                    {TEST_LOCATIONS.map((loc) => (
                      <option key={loc.name} value={loc.name} style={{ background: '#0f172a', color: '#fff' }}>
                        {loc.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Main Booking Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '28px', alignItems: 'start' }}>
              
              {/* Left Column: Nearby Venues */}
              <div>
                <div style={{ marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={18} color="#10b981" />
                    Step 1: Nearby Venues (Distance Sorted)
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {venues.map((venue) => (
                    <VenueCard
                      key={venue.id}
                      venue={venue}
                      isSelected={selectedVenue && selectedVenue.id === venue.id}
                      onSelect={handleSelectVenue}
                    />
                  ))}
                </div>
              </div>

              {/* Right Column: Court Selection & Time Slot Picker */}
              <div className="glass-panel" style={{ padding: '28px' }}>
                {selectedVenue ? (
                  <div>
                    <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700, textTransform: 'uppercase' }}>
                        Selected Venue
                      </div>
                      <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>
                        {selectedVenue.name}
                      </h2>
                      <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' }}>
                        {selectedVenue.address}
                      </div>
                    </div>

                    <CourtSelector
                      courts={courts}
                      selectedCourt={selectedCourt}
                      onSelectCourt={(c) => {
                        setSelectedCourt(c);
                        setSelectedSlot(null);
                      }}
                    />

                    {selectedCourt && (
                      <SlotPicker
                        court={selectedCourt}
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                        selectedSlot={selectedSlot}
                        setSelectedSlot={setSelectedSlot}
                      />
                    )}

                    {/* Booking Action Bar */}
                    <div style={{ marginTop: '32px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        {selectedSlot ? (
                          <div>
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Selected Slot</div>
                            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#10b981' }}>{selectedSlot.label}</div>
                          </div>
                        ) : (
                          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Select a valid court & time slot</div>
                        )}
                      </div>

                      <button
                        className="btn-primary"
                        disabled={!selectedSlot}
                        onClick={() => setIsConfirmModalOpen(true)}
                      >
                        Proceed to Book
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                    Select a venue from the list to pick courts and reserve slots.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', padding: '24px', textAlign: 'center', fontSize: '0.85rem', color: '#64748b', marginTop: 'auto' }}>
        Badminton Court Booking Web App — Phase 1 React + Express + PostgreSQL
      </footer>

      {/* Booking Confirmation Modal */}
      <BookingConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        venue={selectedVenue}
        court={selectedCourt}
        date={selectedDate}
        slot={selectedSlot}
        user={user}
        onBookingSuccess={handleBookingSuccess}
      />
    </div>
  );
}
