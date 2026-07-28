import jwt from 'jsonwebtoken';
import { findUserByPhone, createUser } from '../models/userModel.js';

const JWT_SECRET = process.env.JWT_SECRET || 'badminton_secret_key_2026';
const FIXED_OTP = '123456';

export const sendOtp = async (req, res) => {
  try {
    const { phone_number } = req.body;
    if (!phone_number) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    return res.json({
      success: true,
      message: `OTP sent to ${phone_number}. (Mock OTP: ${FIXED_OTP})`,
      mockOtp: FIXED_OTP,
    });
  } catch (error) {
    console.error('sendOtp error:', error);
    return res.status(500).json({ error: 'Failed to send OTP' });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { phone_number, otp, name } = req.body;

    if (!phone_number || !otp) {
      return res.status(400).json({ error: 'Phone number and OTP are required' });
    }

    if (otp.trim() !== FIXED_OTP) {
      return res.status(401).json({ error: 'Invalid OTP. Please use 123456' });
    }

    let user = await findUserByPhone(phone_number);
    if (!user) {
      const userName = name && name.trim() ? name.trim() : `Player ${phone_number.slice(-4)}`;
      user = await createUser(phone_number, userName);
    }

    const token = jwt.sign({ userId: user.id, phone_number: user.phone_number }, JWT_SECRET, {
      expiresIn: '7d',
    });

    return res.json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    console.error('verifyOtp error:', error);
    return res.status(500).json({ error: 'Failed to verify OTP' });
  }
};

// Auth middleware to protect routes
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization header missing or invalid' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired authentication token' });
  }
};
