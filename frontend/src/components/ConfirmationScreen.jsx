import React from 'react';
import { CheckCircle2, Calendar, MapPin, Clock, ArrowRight, Trophy } from 'lucide-react';

export default function ConfirmationScreen({ booking, venue, court, slot, onViewBookings, onBookNew }) {
  if (!booking) return null;

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '0 20px' }}>
      <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', background: 'linear-gradient(to right, #10b981, #06b6d4)' }}></div>

        <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 0 30px rgba(16, 185, 129, 0.4)' }}>
          <Trophy size={36} />
        </div>

        <span className="badge badge-confirmed" style={{ marginBottom: '12px' }}>
          <CheckCircle2 size={14} />
          Booking Confirmed
        </span>

        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
          Court Reserved Successfully!
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '24px' }}>
          Booking Ref: <strong style={{ color: '#06b6d4' }}>#BK-{booking.id || '1001'}</strong>
        </p>

        <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px', padding: '24px', textAlign: 'left', marginBottom: '32px' }}>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Venue</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <MapPin size={18} color="#06b6d4" />
              {venue ? venue.name : 'Badminton Venue'}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginLeft: '26px' }}>
              {venue ? venue.address : ''}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Court</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#10b981', marginTop: '2px' }}>
                {court ? court.name : 'Court A'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Date</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={14} color="#06b6d4" />
                {booking.date}
              </div>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Reserved Time</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#38bdf8', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={16} />
                {booking.start_time ? `${booking.start_time.slice(0,5)} - ${booking.end_time.slice(0,5)}` : slot ? slot.label : ''}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={onViewBookings}>
            <Calendar size={18} />
            View My Bookings
          </button>

          <button className="btn-secondary" onClick={onBookNew}>
            Book Another Slot
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
