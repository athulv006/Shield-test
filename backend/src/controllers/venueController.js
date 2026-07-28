import { getVenuesSortedByDistance, getVenueById } from '../models/venueModel.js';

export const getVenues = async (req, res) => {
  try {
    const { lat, lng } = req.query;
    const venues = await getVenuesSortedByDistance(lat, lng);
    return res.json({ success: true, venues });
  } catch (error) {
    console.error('getVenues error:', error);
    return res.status(500).json({ error: 'Failed to fetch venues' });
  }
};

export const getVenue = async (req, res) => {
  try {
    const { id } = req.params;
    const venue = await getVenueById(id);
    if (!venue) {
      return res.status(404).json({ error: 'Venue not found' });
    }
    return res.json({ success: true, venue });
  } catch (error) {
    console.error('getVenue error:', error);
    return res.status(500).json({ error: 'Failed to fetch venue details' });
  }
};
