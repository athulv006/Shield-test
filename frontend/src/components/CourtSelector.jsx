import React from 'react';
import { ShieldCheck, Zap, Layers } from 'lucide-react';

export default function CourtSelector({ courts, selectedCourt, onSelectCourt }) {
  if (!courts || courts.length === 0) {
    return <div style={{ color: '#94a3b8', padding: '16px' }}>Loading courts...</div>;
  }

  return (
    <div style={{ marginBottom: '24px' }}>
      <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        Step 2: Select Court
      </label>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
        {courts.map((court) => {
          const isSelected = selectedCourt && selectedCourt.id === court.id;
          return (
            <div
              key={court.id}
              onClick={() => onSelectCourt(court)}
              style={{
                padding: '16px',
                borderRadius: '14px',
                border: isSelected ? '2px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                background: isSelected ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.2) 100%)' : 'rgba(30, 41, 59, 0.5)',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: isSelected ? '#10b981' : '#f8fafc', marginBottom: '4px' }}>
                {court.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <Layers size={12} color="#06b6d4" />
                Mat Matched
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
