import { query } from '../config/db.js';

export const getCourtsByVenueId = async (venueId) => {
  const result = await query(
    'SELECT id, venue_id, name FROM courts WHERE venue_id = $1 ORDER BY name ASC',
    [venueId]
  );
  return result.rows;
};

export const getCourtById = async (courtId) => {
  const result = await query(
    'SELECT id, venue_id, name FROM courts WHERE id = $1',
    [courtId]
  );
  return result.rows[0] || null;
};
