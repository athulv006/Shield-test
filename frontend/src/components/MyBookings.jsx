import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Layers, AlertCircle, XCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function MyBookings({ onBookNew }) {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.getMyBookings();
      if (res.success) {
        setBookings(res.bookings || []);
      } else {
        setError(res.error || 'Failed to load bookings');
      }
    } catch (err) {
      setError('Network error loading your bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this badminton court booking?')) {
      return;
    }

    setCancellingId(bookingId);
    try {
      const res = await api.cancelBooking(bookingId);
      if (res.success) {
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
        );
      } else {
        alert(res.error || 'Failed to cancel booking');
      }
    } catch (err) {
      alert('Error cancelling booking');
    } finally {
      setCancellingId(null);
    }
  };

  if (!user) {
    return (
      <div className="glass-panel" style={{ maxWidth: '500px', margin: '60px auto', padding: '40px', textAlign: 'center' }}>
        <AlertCircle size={48} color="#f59e0b" style={{ marginBottom: '16px' }} />
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px' }}>Sign In Required</h2>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '20px' }}>
          Please sign in with your phone number to view and manage your court bookings.
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }}>My Bookings</h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '2px' }}>
            View and manage your upcoming and past badminton court reservations.
          </p>
        </div>

        <button className="btn-secondary" onClick={fetchBookings} title="Refresh">
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {error && (
        <div style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#f43f5e', padding: '12px', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
          Fetching your bookings...
        </div>
      ) : bookings.length === 0 ? (
        <div className="glass-panel" style={{ padding: '48px', textAlign: 'center' }}>
          <Calendar size={48} color="#06b6d4" style={{ marginBottom: '16px', opacity: 0.8 }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>No Bookings Found</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '24px' }}>
            You haven't reserved any badminton courts yet.
          </p>
          <button className="btn-primary" onClick={onBookNew}>
            Book a Court Now
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {bookings.map((booking) => {
            const isConfirmed = booking.status === 'confirmed';
            return (
              <div key={booking.id} className="glass-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff' }}>
                        {booking.venue_name || 'Badminton Club'}
                      </h3>
                      <span className={`badge ${isConfirmed ? 'badge-confirmed' : 'badge-cancelled'}`}>
                        {isConfirmed ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        {booking.status.toUpperCase()}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={14} color="#06b6d4" />
                      {booking.venue_address}
                    </p>
                  </div>

                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Ref: #BK-{booking.id}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', padding: '16px', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)', marginBottom: isConfirmed ? '16px' : 0 }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Court</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#10b981', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Layers size={14} />
                      {booking.court_name}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Date</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={14} color="#06b6d4" />
                      {booking.date ? String(booking.date).slice(0, 10) : ''}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Time Slot</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#38bdf8', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} />
                      {booking.start_time ? `${booking.start_time.slice(0,5)} - ${booking.end_time.slice(0,5)}` : ''}
                    </div>
                  </div>
                </div>

                {isConfirmed && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      className="btn-danger"
                      onClick={() => handleCancelBooking(booking.id)}
                      disabled={cancellingId === booking.id}
                    >
                      {cancellingId === booking.id ? 'Cancelling...' : 'Cancel Booking'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
