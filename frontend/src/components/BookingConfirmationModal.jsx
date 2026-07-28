import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, Layers, User, CheckCircle2 } from 'lucide-react';
import { api } from '../api/client';

export default function BookingConfirmationModal({ isOpen, onClose, venue, court, date, slot, user, onBookingSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !venue || !court || !slot) return null;

  const handleConfirm = async () => {
    setError('');
    setLoading(true);

    try {
      const res = await api.createBooking(court.id, date, slot.start, slot.end);
      if (res.success) {
        onBookingSuccess(res.booking);
      } else {
        setError(res.error || 'Failed to complete booking.');
      }
    } catch (err) {
      setError('Network error while placing booking.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)', padding: '20px' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '32px', position: 'relative' }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
        >
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <CheckCircle2 size={32} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '6px' }}>Confirm Reservation</h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Review your badminton court slot details before confirming.</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#f43f5e', padding: '12px', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '14px', padding: '20px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <MapPin size={20} color="#06b6d4" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#ffffff' }}>{venue.name}</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>{venue.address}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Court</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#10b981', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Layers size={14} />
                {court.name}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Date</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={14} color="#06b6d4" />
                {date}
              </div>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Time Slot</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#38bdf8', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={16} />
                {slot.label}
              </div>
            </div>

            <div style={{ gridColumn: '1 / -1', paddingTop: '12px', borderTop: '1px dashed rgba(255,255,255,0.1)' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Player Profile</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#cbd5e1', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={14} />
                {user ? `${user.name} (${user.phone_number})` : 'Guest'}
              </div>
            </div>
          </div>
        </div>

        <button className="btn-primary" style={{ width: '100%', padding: '14px' }} onClick={handleConfirm} disabled={loading}>
          {loading ? 'Processing Booking...' : 'Confirm & Reserve Slot'}
        </button>
      </div>
    </div>
  );
}
