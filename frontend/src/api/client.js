const API_BASE_URL = 'http://localhost:5001/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('badminton_auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
  // Auth API
  sendOtp: async (phoneNumber) => {
    const res = await fetch(`${API_BASE_URL}/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone_number: phoneNumber }),
    });
    return res.json();
  },

  verifyOtp: async (phoneNumber, otp, name) => {
    const res = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone_number: phoneNumber, otp, name }),
    });
    return res.json();
  },

  // Venues API
  getVenues: async (lat, lng) => {
    let url = `${API_BASE_URL}/venues`;
    if (lat != null && lng != null) {
      url += `?lat=${lat}&lng=${lng}`;
    }
    const res = await fetch(url);
    return res.json();
  },

  // Courts API
  getCourts: async (venueId) => {
    const res = await fetch(`${API_BASE_URL}/venues/${venueId}/courts`);
    return res.json();
  },

  // Court Bookings slot API
  getCourtBookings: async (courtId, dateStr) => {
    const res = await fetch(`${API_BASE_URL}/courts/${courtId}/bookings?date=${dateStr}`);
    return res.json();
  },

  // Create Booking
  createBooking: async (courtId, dateStr, startTime, endTime) => {
    const res = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({
        court_id: courtId,
        date: dateStr,
        start_time: startTime,
        end_time: endTime,
      }),
    });
    return res.json();
  },

  // Get My Bookings
  getMyBookings: async () => {
    const res = await fetch(`${API_BASE_URL}/bookings/my-bookings`, {
      headers: {
        ...getAuthHeader(),
      },
    });
    return res.json();
  },

  // Cancel Booking
  cancelBooking: async (bookingId) => {
    const res = await fetch(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {
      method: 'PATCH',
      headers: {
        ...getAuthHeader(),
      },
    });
    return res.json();
  },
};
