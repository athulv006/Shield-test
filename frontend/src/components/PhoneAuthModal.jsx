import React, { useState } from 'react';
import { X, Smartphone, ShieldCheck, UserCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

export default function PhoneAuthModal({ isOpen, onClose, onSuccess }) {
  const { loginWithOtp } = useAuth();
  const [step, setStep] = useState(1); // 1: Phone input, 2: OTP input
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  if (!isOpen) return null;

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
      if (result.success) {
        onClose();
        if (onSuccess) onSuccess();
      } else {
        setError(result.error || 'Invalid OTP');
      }
    } catch (err) {
      setError('Error verifying OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleUseMockOtp = () => {
    setOtp('123456');
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)', padding: '20px' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '32px', position: 'relative' }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
        >
          <X size={20} />
        </button>

        {step === 1 ? (
          <form onSubmit={handleSendOtp}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Smartphone size={28} />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '6px' }}>Login / Register</h2>
              <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Enter your phone number to receive a verification OTP.</p>
            </div>

            {error && (
              <div style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#f43f5e', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '16px' }}>
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
                style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#ffffff', padding: '12px 16px', borderRadius: '10px', fontSize: '1rem', outline: 'none' }}
                required
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Sending OTP...' : 'Send Mock OTP'}
              <ArrowRight size={18} />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <ShieldCheck size={28} />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '6px' }}>Verify OTP</h2>
              <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
                Sent code to <strong>{phoneNumber}</strong>
              </p>
            </div>

            {infoMsg && (
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>{infoMsg}</span>
                <button
                  type="button"
                  onClick={handleUseMockOtp}
                  style={{ background: '#10b981', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Auto Fill 123456
                </button>
              </div>
            )}

            {error && (
              <div style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#f43f5e', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '16px' }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '8px' }}>
                Your Name (for booking receipt)
              </label>
              <input
                type="text"
                placeholder="Alex Morgan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#ffffff', padding: '10px 14px', borderRadius: '10px', fontSize: '0.95rem', outline: 'none' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '8px' }}>
                6-Digit Verification Code
              </label>
              <input
                type="text"
                placeholder="123456"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#ffffff', padding: '12px 16px', borderRadius: '10px', fontSize: '1.2rem', letterSpacing: '4px', textAlign: 'center', outline: 'none' }}
                required
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Verifying...' : 'Verify & Continue'}
              <UserCheck size={18} />
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              style={{ background: 'transparent', border: 'none', color: '#94a3b8', width: '100%', marginTop: '12px', fontSize: '0.85rem', cursor: 'pointer' }}
            >
              Change Phone Number
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
