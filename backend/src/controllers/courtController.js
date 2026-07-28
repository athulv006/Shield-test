import { getCourtsByVenueId, getCourtById } from '../models/courtModel.js';
import { getConfirmedBookingsForCourtAndDate } from '../models/bookingModel.js';

export const getCourtsForVenue = async (req, res) => {
  try {
    const { venueId } = req.params;
    const courts = await getCourtsByVenueId(venueId);
    return res.json({ success: true, courts });
  } catch (error) {
    console.error('getCourtsForVenue error:', error);
    return res.status(500).json({ error: 'Failed to fetch courts' });
  }
};

export const getBookingsForCourtAndDate = async (req, res) => {
  try {
    const { courtId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Date query parameter is required (YYYY-MM-DD)' });
    }

    const court = await getCourtById(courtId);
    if (!court) {
      return res.status(404).json({ error: 'Court not found' });
    }

    const bookings = await getConfirmedBookingsForCourtAndDate(courtId, date);
    return res.json({
      success: true,
      court,
      date,
      bookedSlots: bookings.map((b) => ({
        id: b.id,
        start_time: b.start_time,
        end_time: b.end_time,
      })),
    });
  } catch (error) {
    console.error('getBookingsForCourtAndDate error:', error);
    return res.status(500).json({ error: 'Failed to fetch court bookings' });
  }
};
