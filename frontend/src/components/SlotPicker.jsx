import React, { useState, useEffect } from 'react';
import { Calendar, Clock, AlertCircle, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';
import { api } from '../api/client';

// Generate 30-minute time options from 06:00 to 22:00
function generateTimeOptions() {
  const times = [];
  for (let hour = 6; hour <= 22; hour++) {
    for (let min of [0, 30]) {
      if (hour === 22 && min === 30) break; // End at 22:00
      const hStr = String(hour).padStart(2, '0');
      const mStr = String(min).padStart(2, '0');
      const value = `${hStr}:${mStr}:00`;

      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 === 0 ? 12 : hour % 12;
      const label = `${displayHour}:${mStr === '00' ? '00' : mStr} ${ampm}`;

      times.push({ value, label, hour, min });
    }
  }
  return times;
}

const TIME_OPTIONS = generateTimeOptions();

// Preset time slots requested by user and common examples
const PRESET_SLOTS = [
  { start: '06:00:00', end: '06:30:00', label: '06:00 AM - 06:30 AM (30m)' },
  { start: '07:00:00', end: '08:30:00', label: '07:00 AM - 08:30 AM (1.5h)' },
  { start: '09:30:00', end: '10:30:00', label: '09:30 AM - 10:30 AM (1h)' },
  { start: '17:00:00', end: '18:30:00', label: '05:00 PM - 06:30 PM (1.5h)' },
  { start: '19:00:00', end: '20:30:00', label: '07:00 PM - 08:30 PM (1.5h)' },
];

export default function SlotPicker({ court, selectedDate, setSelectedDate, selectedSlot, setSelectedSlot }) {
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  // Time selection mode state
  const [startTimeVal, setStartTimeVal] = useState('07:00:00');
  const [endTimeVal, setEndTimeVal] = useState('08:30:00');
  const [customError, setCustomError] = useState('');

  // Quick dates
  const quickDates = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
    const formatted = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return { dateStr, dayName, formatted };
  });

  useEffect(() => {
    if (!court || !selectedDate) return;

    let isMounted = true;
    setLoading(true);

    api.getCourtBookings(court.id, selectedDate)
      .then((data) => {
        if (isMounted && data.success) {
          setBookedSlots(data.bookedSlots || []);
        }
      })
      .catch((err) => console.error('Error fetching booked slots:', err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [court, selectedDate]);

  // Check if a range [start, end] overlaps with any booked slot
  const checkRangeOverlap = (start, end) => {
    return bookedSlots.some((b) => {
      const bStart = b.start_time.slice(0, 5);
      const bEnd = b.end_time.slice(0, 5);
      const sStart = start.slice(0, 5);
      const sEnd = end.slice(0, 5);
      return sStart < bEnd && sEnd > bStart;
    });
  };

  // Helper to format time label
  const formatTimeLabel = (val) => {
    const opt = TIME_OPTIONS.find((t) => t.value === val);
    if (opt) return opt.label;
    if (val === '22:00:00') return '10:00 PM';
    return val.slice(0, 5);
  };

  // Update selected custom time range
  const handleStartTimeChange = (newStart) => {
    setStartTimeVal(newStart);
    setCustomError('');

    // If current end time is not strictly later than new start time, auto-adjust end time to newStart + 30 mins (or 1 hour)
    const [sH, sM] = newStart.split(':').map(Number);
    let targetMin = sH * 60 + sM + 60; // default +1 hour
    if (targetMin > 22 * 60) targetMin = 22 * 60;

    const endH = String(Math.floor(targetMin / 60)).padStart(2, '0');
    const endM = String(targetMin % 60).padStart(2, '0');
    const autoEnd = `${endH}:${endM}:00`;

    let finalEnd = endTimeVal;
    if (endTimeVal <= newStart) {
      finalEnd = autoEnd;
      setEndTimeVal(autoEnd);
    }

    validateAndSetSlot(newStart, finalEnd);
  };

  const handleEndTimeChange = (newEnd) => {
    setEndTimeVal(newEnd);
    setCustomError('');
    validateAndSetSlot(startTimeVal, newEnd);
  };

  const validateAndSetSlot = (start, end) => {
    if (start >= end) {
      setCustomError('End time must be later than start time.');
      setSelectedSlot(null);
      return;
    }

    const hasOverlap = checkRangeOverlap(start, end);
    if (hasOverlap) {
      setCustomError('Selected time range overlaps with an existing booking.');
      setSelectedSlot(null);
      return;
    }

    const [sH, sM] = start.split(':').map(Number);
    const [eH, eM] = end.split(':').map(Number);
    const totalMinutes = eH * 60 + eM - (sH * 60 + sM);
    const hrs = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    const durStr = `${hrs > 0 ? `${hrs}h ` : ''}${mins > 0 ? `${mins}m` : ''}`.trim();

    const label = `${formatTimeLabel(start)} - ${formatTimeLabel(end)} (${durStr})`;
    setSelectedSlot({ start, end, label });
  };

  const handleTimeRangeChange = (newStart, newEnd) => {
    setStartTimeVal(newStart);
    setEndTimeVal(newEnd);
    validateAndSetSlot(newStart, newEnd);
  };

  // Trigger default valid slot selection when court/date changes
  useEffect(() => {
    validateAndSetSlot(startTimeVal, endTimeVal);
  }, [bookedSlots]);

  return (
    <div style={{ marginTop: '24px' }}>
      {/* Date Picker */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={16} color="#10b981" />
            Step 3: Select Date
          </label>
          <input
            type="date"
            value={selectedDate}
            min={quickDates[0].dateStr}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setSelectedSlot(null);
            }}
            style={{
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              outline: 'none',
              fontFamily: 'inherit',
            }}
          />
        </div>

        {/* Quick Date Pills */}
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '8px' }}>
          {quickDates.map((item) => {
            const isSelected = selectedDate === item.dateStr;
            return (
              <button
                key={item.dateStr}
                type="button"
                onClick={() => {
                  setSelectedDate(item.dateStr);
                  setSelectedSlot(null);
                }}
                style={{
                  background: isSelected ? '#10b981' : 'rgba(30, 41, 59, 0.6)',
                  color: isSelected ? '#ffffff' : '#cbd5e1',
                  border: isSelected ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '10px 16px',
                  minWidth: '90px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  flexShrink: 0,
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', opacity: 0.9 }}>
                  {item.dayName}
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, marginTop: '2px' }}>
                  {item.formatted}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Flexible 30-Min Time Range Picker */}
      <div>
        <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <Clock size={16} color="#06b6d4" />
          Step 4: Choose Custom Time (30-min Intervals)
        </label>

        {/* Preset quick selection pills */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} color="#f59e0b" />
            Quick Sample Slots:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {PRESET_SLOTS.map((p) => {
              const isOverlap = checkRangeOverlap(p.start, p.end);
              const isSelected = selectedSlot && selectedSlot.start === p.start && selectedSlot.end === p.end;
              return (
                <button
                  key={p.start + p.end}
                  type="button"
                  disabled={isOverlap}
                  onClick={() => {
                    setStartTimeVal(p.start);
                    setEndTimeVal(p.end);
                    handleTimeRangeChange(p.start, p.end);
                  }}
                  style={{
                    background: isSelected
                      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                      : isOverlap
                      ? 'rgba(15, 23, 42, 0.6)'
                      : 'rgba(30, 41, 59, 0.6)',
                    color: isOverlap ? '#64748b' : isSelected ? '#ffffff' : '#cbd5e1',
                    border: isSelected
                      ? '1px solid #10b981'
                      : isOverlap
                      ? '1px solid rgba(255, 255, 255, 0.05)'
                      : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: isOverlap ? 'not-allowed' : 'pointer',
                    textDecoration: isOverlap ? 'line-through' : 'none',
                  }}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Start Time & End Time Dropdowns */}
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '14px', padding: '18px', marginBottom: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
                Start Time
              </label>
              <select
                value={startTimeVal}
                onChange={(e) => handleStartTimeChange(e.target.value)}
                style={{ width: '100%', background: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#ffffff', padding: '10px', borderRadius: '10px', fontSize: '0.95rem', fontWeight: 600, outline: 'none' }}
              >
                {/* Exclude 22:00 (10 PM) from start times since court closes at 10 PM */}
                {TIME_OPTIONS.filter((t) => t.value < '22:00:00').map((t) => (
                  <option key={t.value} value={t.value} style={{ background: '#0f172a', color: '#fff' }}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
                End Time
              </label>
              <select
                value={endTimeVal}
                onChange={(e) => handleEndTimeChange(e.target.value)}
                style={{ width: '100%', background: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#ffffff', padding: '10px', borderRadius: '10px', fontSize: '0.95rem', fontWeight: 600, outline: 'none' }}
              >
                {/* Only show end times strictly later than start time */}
                {[...TIME_OPTIONS, { value: '22:00:00', label: '10:00 PM' }]
                  .filter((t) => t.value > startTimeVal)
                  .map((t) => (
                    <option key={t.value} value={t.value} style={{ background: '#0f172a', color: '#fff' }}>
                      {t.label}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {customError && (
            <div style={{ marginTop: '14px', background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#f43f5e', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={16} />
              {customError}
            </div>
          )}
        </div>

        {/* 30-Min Timeline Availability Overview */}
        <div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, marginBottom: '8px' }}>
            30-Min Block Timeline ({court.name}):
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(105px, 1fr))', gap: '8px', maxHeight: '180px', overflowY: 'auto', paddingRight: '4px' }}>
            {TIME_OPTIONS.map((t, idx) => {
              const nextVal = TIME_OPTIONS[idx + 1] ? TIME_OPTIONS[idx + 1].value : '22:00:00';
              const isOccupied = checkRangeOverlap(t.value, nextVal);
              const inCurrentSelection = startTimeVal <= t.value && nextVal <= endTimeVal && !customError;

              return (
                <div
                  key={t.value}
                  onClick={() => {
                    if (!isOccupied) {
                      setStartTimeVal(t.value);
                      setEndTimeVal(nextVal);
                      handleTimeRangeChange(t.value, nextVal);
                    }
                  }}
                  style={{
                    padding: '8px 6px',
                    borderRadius: '8px',
                    border: inCurrentSelection
                      ? '1px solid #10b981'
                      : isOccupied
                      ? '1px solid rgba(255, 255, 255, 0.05)'
                      : '1px solid rgba(255, 255, 255, 0.08)',
                    background: inCurrentSelection
                      ? 'rgba(16, 185, 129, 0.25)'
                      : isOccupied
                      ? 'rgba(15, 23, 42, 0.7)'
                      : 'rgba(30, 41, 59, 0.5)',
                    textAlign: 'center',
                    fontSize: '0.75rem',
                    cursor: isOccupied ? 'not-allowed' : 'pointer',
                    opacity: isOccupied ? 0.45 : 1,
                    textDecoration: isOccupied ? 'line-through' : 'none',
                    color: isOccupied ? '#64748b' : inCurrentSelection ? '#ffffff' : '#cbd5e1',
                  }}
                >
                  {t.label}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
