import React from 'react';
import { MapPin, User, LogOut, Navigation, Calendar, Flame } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Header({
  activeTab,
  setActiveTab,
  userLocation,
  onRequestLocation,
  onOpenAuthModal,
}) {
  const { user, logout } = useAuth();

  return (
    <header style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 50, background: 'rgba(15, 23, 42, 0.85)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setActiveTab('venues')}>
          <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)', width: '42px', height: '42px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)' }}>
            <Flame size={24} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, background: 'linear-gradient(to right, #ffffff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.5px' }}>
              ShuttleSpot
            </h1>
            <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Badminton Court Booking
            </span>
          </div>
        </div>

        {/* Location Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(30, 41, 59, 0.7)', padding: '6px 14px', borderRadius: '30px', border: '1px solid rgba(255, 255, 255, 0.08)', fontSize: '0.85rem' }}>
          <MapPin size={16} color="#06b6d4" />
          {userLocation ? (
            <span>
              Near: <strong style={{ color: '#06b6d4' }}>{userLocation.name || `${userLocation.lat.toFixed(2)}, ${userLocation.lng.toFixed(2)}`}</strong>
            </span>
          ) : (
            <span style={{ color: '#94a3b8' }}>Detecting location...</span>
          )}
          <button
            onClick={onRequestLocation}
            title="Refresh location"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#06b6d4', display: 'flex', alignItems: 'center', padding: '2px', marginLeft: '4px' }}
          >
            <Navigation size={14} />
          </button>
        </div>

        {/* Tab Navigation & Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <nav style={{ display: 'flex', background: 'rgba(30, 41, 59, 0.5)', padding: '4px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <button
              onClick={() => setActiveTab('venues')}
              style={{
                background: activeTab === 'venues' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'transparent',
                color: activeTab === 'venues' ? '#ffffff' : '#94a3b8',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              Courts & Venues
            </button>
            <button
              onClick={() => {
                if (!user) {
                  onOpenAuthModal();
                } else {
                  setActiveTab('my-bookings');
                }
              }}
              style={{
                background: activeTab === 'my-bookings' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'transparent',
                color: activeTab === 'my-bookings' ? '#ffffff' : '#94a3b8',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease',
              }}
            >
              <Calendar size={16} />
              My Bookings
            </button>
          </nav>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(30, 41, 59, 0.6)', padding: '6px 12px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>{user.name}</div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{user.phone_number}</div>
              </div>
              <button
                onClick={logout}
                title="Log Out"
                style={{ background: 'transparent', border: 'none', color: '#f43f5e', cursor: 'pointer', padding: '4px', marginLeft: '4px' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button className="btn-primary" onClick={onOpenAuthModal}>
              <User size={18} />
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
