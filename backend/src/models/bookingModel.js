import { query } from '../config/db.js';

/**
 * Check if an overlapping confirmed booking exists on court_id & date
 */
export const checkBookingOverlap = async (courtId, date, startTime, endTime) => {
  const result = await query(
    `SELECT id FROM bookings
     WHERE court_id = $1
       AND date = $2
       AND status = 'confirmed'
       AND (start_time < $4 AND end_time > $3)`,
    [courtId, date, startTime, endTime]
  );
  return result.rows.length > 0;
};

/**
 * Get all confirmed bookings for a specific court and date
 */
export const getConfirmedBookingsForCourtAndDate = async (courtId, date) => {
  const result = await query(
    `SELECT id, start_time, end_time, status
     FROM bookings
     WHERE court_id = $1
       AND date = $2
       AND status = 'confirmed'
     ORDER BY start_time ASC`,
    [courtId, date]
  );
  return result.rows;
};

/**
 * Create a new booking
 */
export const createBookingRecord = async ({ courtId, userId, date, startTime, endTime }) => {
  const result = await query(
    `INSERT INTO bookings (court_id, user_id, date, start_time, end_time, status)
     VALUES ($1, $2, $3, $4, $5, 'confirmed')
     RETURNING id, court_id, user_id, date, start_time, end_time, status, created_at`,
    [courtId, userId, date, startTime, endTime]
  );
  return result.rows[0];
};

/**
 * Get all bookings for a user with venue and court metadata
 */
export const getBookingsByUserId = async (userId) => {
  const result = await query(
    `SELECT b.id, b.court_id, b.user_id, b.date, b.start_time, b.end_time, b.status, b.created_at,
            c.name AS court_name,
            v.name AS venue_name, v.address AS venue_address
     FROM bookings b
     JOIN courts c ON c.id = b.court_id
     JOIN venues v ON v.id = c.venue_id
     WHERE b.user_id = $1
     ORDER BY b.date DESC, b.start_time DESC`,
    [userId]
  );
  return result.rows;
};

/**
 * Cancel a booking by setting status to 'cancelled'
 */
export const cancelBookingRecord = async (bookingId, userId) => {
  const result = await query(
    `UPDATE bookings
     SET status = 'cancelled'
     WHERE id = $1 AND user_id = $2
     RETURNING id, court_id, user_id, date, start_time, end_time, status`,
    [bookingId, userId]
  );
  return result.rows[0] || null;
};
