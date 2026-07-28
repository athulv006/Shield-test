import React from 'react';
import { MapPin, LayoutGrid, ChevronRight, Award } from 'lucide-react';

export default function VenueCard({ venue, isSelected, onSelect }) {
  return (
    <div
      className="glass-card"
      onClick={() => onSelect(venue)}
      style={{
        padding: '24px',
        cursor: 'pointer',
        border: isSelected ? '2px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
        background: isSelected ? 'rgba(16, 185, 129, 0.08)' : 'rgba(30, 41, 59, 0.6)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {isSelected && (
        <div style={{ position: 'absolute', top: 0, right: 0, background: '#10b981', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '4px 12px', borderBottomLeftRadius: '10px', textTransform: 'uppercase' }}>
          Selected
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', marginBottom: '6px' }}>
            {venue.name}
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={14} color="#06b6d4" />
            {venue.address}
          </p>
        </div>

        {venue.distance_km != null && (
          <span className="badge badge-distance">
            <MapPin size={12} />
            {venue.distance_km} km away
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.85rem', color: '#cbd5e1' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <LayoutGrid size={16} color="#10b981" />
            {venue.court_count || 3} Indoor Courts
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8' }}>
            <Award size={16} />
            BWF Standard Turf
          </span>
        </div>

        <div style={{ color: isSelected ? '#10b981' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600, fontSize: '0.85rem' }}>
          {isSelected ? 'Viewing Courts' : 'Select Venue'}
          <ChevronRight size={16} />
        </div>
      </div>
    </div>
  );
}
