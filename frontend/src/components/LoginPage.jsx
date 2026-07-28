import React, { useState } from 'react';
import { Flame, Smartphone, ShieldCheck, UserCheck, ArrowRight, MapPin, Calendar, Clock, CheckCircle2, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

export default function LoginPage() {
  const { loginWithOtp } = useAuth();
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setInfoMsg('');

    if (!phoneNumber || phoneNumber.trim().length < 8) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    try {
      const res = await api.sendOtp(phoneNumber.trim());
      if (res.success) {
        setInfoMsg(res.message);
        setStep(2);
      } else {
        setError(res.error || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Network error sending OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');

    if (!otp || otp.trim().length !== 6) {
      setError('Please enter 6-digit OTP (123456)');
      return;
    }

    setLoading(true);
    try {
      const result = await loginWithOtp(phoneNumber.trim(), otp.trim(), name.trim());
      if (!result.success) {
        setError(result.error || 'Invalid OTP');
      }
    } catch (err) {
      setError('Error verifying OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await loginWithOtp('+15550192834', '123456', 'Alex Morgan');
    } catch (err) {
      setError('Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-dark)', color: '#ffffff' }}>
      {/* Top Bar */}
      <header style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', padding: '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)', width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)' }}>
            <Flame size={26} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, background: 'linear-gradient(to right, #ffffff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              ShuttleSpot
            </h1>
            <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Badminton Court Booking
            </span>
          </div>
        </div>

        <button
          onClick={handleDemoLogin}
          className="btn-secondary"
          style={{ fontSize: '0.85rem', borderColor: '#10b981', color: '#10b981' }}
        >
          <Zap size={16} />
          Quick Demo Login
        </button>
      </header>

      {/* Hero & Login Section */}
      <div style={{ flex: 1, maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '40px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '48px', alignItems: 'center' }}>
        
        {/* Left Column: Product Value Props */}
        <div>
          <span className="badge badge-confirmed" style={{ padding: '6px 14px', fontSize: '0.85rem', marginBottom: '20px' }}>
            <CheckCircle2 size={16} />
            Phase 1 Badminton Booking Platform
          </span>

          <h2 style={{ fontSize: '2.8rem', fontWeight: 800, lineHeight: 1.15, color: '#ffffff', marginBottom: '20px' }}>
            Book Badminton Courts <br />
            <span style={{ background: 'linear-gradient(to right, #10b981, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Near You in Seconds
            </span>
          </h2>

          <p style={{ fontSize: '1.1rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '36px' }}>
            Find nearby venues sorted by distance, choose flexible 30-min time slots, view real-time court availability, and manage your bookings effortlessly.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '16px' }}>
              <MapPin size={22} color="#06b6d4" style={{ marginBottom: '8px' }} />
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>Geolocation Sorting</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>Automatic distance calculation to nearby sports hubs.</div>
            </div>

            <div style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '16px' }}>
              <Clock size={22} color="#10b981" style={{ marginBottom: '8px' }} />
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>Flexible 30-Min Slots</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>Book custom durations like 7am-8:30am or 9:30am-10:30am.</div>
            </div>
          </div>
        </div>

        {/* Right Column: Login Card */}
        <div className="glass-panel" style={{ padding: '40px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
          {step === 1 ? (
            <form onSubmit={handleSendOtp}>
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '18px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Smartphone size={32} />
                </div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>
                  Sign In to Dashboard
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
                  Enter your phone number to receive a verification OTP.
                </p>
              </div>

              {error && (
                <div style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#f43f5e', padding: '12px', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '20px' }}>
                  {error}
                </div>
              )}

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '8px' }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  style={{ width: '100%', background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#ffffff', padding: '14px 18px', borderRadius: '12px', fontSize: '1.05rem', outline: 'none' }}
                  required
                />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1rem' }} disabled={loading}>
                {loading ? 'Sending OTP...' : 'Send Mock OTP'}
                <ArrowRight size={18} />
              </button>

              <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  style={{ background: 'transparent', border: 'none', color: '#06b6d4', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  ⚡ One-Click Demo Sign In (Alex Morgan)
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp}>
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '18px', background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <ShieldCheck size={32} />
                </div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>
                  Verify OTP Code
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
                  Code sent to <strong>{phoneNumber}</strong>
                </p>
              </div>

              {infoMsg && (
                <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', padding: '12px', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>{infoMsg}</span>
                  <button
                    type="button"
                    onClick={() => setOtp('123456')}
                    style={{ background: '#10b981', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Auto Fill 123456
                  </button>
                </div>
              )}

              {error && (
                <div style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#f43f5e', padding: '12px', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '20px' }}>
                  {error}
                </div>
              )}

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '8px' }}>
                  Player Name
                </label>
                <input
                  type="text"
                  placeholder="Alex Morgan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%', background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#ffffff', padding: '12px 16px', borderRadius: '10px', fontSize: '0.95rem', outline: 'none' }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '8px' }}>
                  6-Digit OTP Code
                </label>
                <input
                  type="text"
                  placeholder="123456"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  style={{ width: '100%', background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#ffffff', padding: '14px 18px', borderRadius: '12px', fontSize: '1.25rem', letterSpacing: '4px', textAlign: 'center', outline: 'none' }}
                  required
                />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1rem' }} disabled={loading}>
                {loading ? 'Verifying...' : 'Verify OTP & Enter Dashboard'}
                <UserCheck size={18} />
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', width: '100%', marginTop: '14px', fontSize: '0.85rem', cursor: 'pointer' }}
              >
                Change Phone Number
              </button>
            </form>
          )}
        </div>
      </div>

      <footer style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', padding: '24px', textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>
        Badminton Court Booking Platform — Phase 1 React + Express + PostgreSQL
      </footer>
    </div>
  );
}
