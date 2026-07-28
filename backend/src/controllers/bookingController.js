import {
  checkBookingOverlap,
  createBookingRecord,
  getBookingsByUserId,
  cancelBookingRecord,
} from '../models/bookingModel.js';
import { getCourtById } from '../models/courtModel.js';

export const createBooking = async (req, res) => {
  try {
    const { court_id, date, start_time, end_time } = req.body;
    const userId = req.user.userId;

    if (!court_id || !date || !start_time || !end_time) {
      return res.status(400).json({ error: 'court_id, date, start_time, and end_time are required' });
    }

    const court = await getCourtById(court_id);
    if (!court) {
      return res.status(404).json({ error: 'Court not found' });
    }

    // Check for overlapping confirmed bookings
    const isOverlapping = await checkBookingOverlap(court_id, date, start_time, end_time);
    if (isOverlapping) {
      return res.status(409).json({
        error: 'This court is already booked for the selected time slot. Please choose another slot.',
      });
    }

    const booking = await createBookingRecord({
      courtId: court_id,
      userId,
      date,
      startTime: start_time,
      endTime: end_time,
    });

    return res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully!',
      booking,
    });
  } catch (error) {
    console.error('createBooking error:', error);
    return res.status(500).json({ error: 'Failed to create booking' });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const userId = req.user.userId;
    const bookings = await getBookingsByUserId(userId);
    return res.json({ success: true, bookings });
  } catch (error) {
    console.error('getMyBookings error:', error);
    return res.status(500).json({ error: 'Failed to fetch user bookings' });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const updatedBooking = await cancelBookingRecord(id, userId);
    if (!updatedBooking) {
      return res.status(404).json({ error: 'Booking not found or unauthorized to cancel' });
    }

    return res.json({
      success: true,
      message: 'Booking has been cancelled',
      booking: updatedBooking,
    });
  } catch (error) {
    console.error('cancelBooking error:', error);
    return res.status(500).json({ error: 'Failed to cancel booking' });
  }
};
