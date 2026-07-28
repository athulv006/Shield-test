import { query } from '../config/db.js';

// Haversine formula to calculate distance between two coordinates in kilometers
function calculateDistance(lat1, lon1, lat2, lon2) {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return 0;
  const R = 6371; // Radius of Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10; // distance in km rounded to 1 decimal place
}

export const getAllVenues = async () => {
  const result = await query(
    `SELECT v.id, v.name, v.latitude, v.longitude, v.address,
            COUNT(c.id)::int AS court_count
     FROM venues v
     LEFT JOIN courts c ON c.venue_id = v.id
     GROUP BY v.id, v.name, v.latitude, v.longitude, v.address`
  );
  return result.rows;
};

export const getVenuesSortedByDistance = async (userLat, userLng) => {
  const venues = await getAllVenues();
  
  if (userLat != null && userLng != null) {
    const lat = parseFloat(userLat);
    const lng = parseFloat(userLng);
    
    return venues
      .map((venue) => {
        const vLat = parseFloat(venue.latitude);
        const vLng = parseFloat(venue.longitude);
        const distance = calculateDistance(lat, lng, vLat, vLng);
        return {
          ...venue,
          latitude: vLat,
          longitude: vLng,
          distance_km: distance,
        };
      })
      .sort((a, b) => a.distance_km - b.distance_km);
  }
  
  return venues.map((venue) => ({
    ...venue,
    latitude: parseFloat(venue.latitude),
    longitude: parseFloat(venue.longitude),
    distance_km: null,
  }));
};

export const getVenueById = async (id) => {
  const result = await query(
    'SELECT id, name, latitude, longitude, address FROM venues WHERE id = $1',
    [id]
  );
  if (!result.rows[0]) return null;
  const v = result.rows[0];
  return {
    ...v,
    latitude: parseFloat(v.latitude),
    longitude: parseFloat(v.longitude),
  };
};
