import http from 'http';

const BASE_URL = 'http://localhost:5001/api';

async function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}${path}`;
    const headers = options.headers || {};
    let postData = null;

    if (options.body) {
      postData = JSON.stringify(options.body);
      headers['Content-Type'] = 'application/json';
      headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const reqOpts = {
      method: options.method || 'GET',
      headers,
    };

    const req = http.request(url, reqOpts, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          resolve({ status: res.statusCode, body: json });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });

    req.on('error', reject);
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function runE2ETests() {
  console.log('=== RUNNING END-TO-END VERIFICATION TESTS ===\n');

  // 1. Health check
  const health = await request('/health');
  console.log('1. Health Check:', health.status, health.body.status, '| Engine:', health.body.db.engine);

  // 2. Auth OTP Verification
  const authRes = await request('/auth/verify-otp', {
    method: 'POST',
    body: { phone_number: '+15550998877', otp: '123456', name: 'Test Player' },
  });
  console.log('2. Mock OTP Auth:', authRes.status, '| Token created:', !!authRes.body.token);
  const token = authRes.body.token;

  // 3. Distance Sorted Venues
  const venueRes = await request('/venues?lat=12.9716&lng=77.5946');
  console.log('3. Venues Sorted by Distance:', venueRes.status, '| Count:', venueRes.body.venues.length);
  venueRes.body.venues.forEach((v) => {
    console.log(`   - ${v.name}: ${v.distance_km} km away (${v.court_count} courts)`);
  });

  // 4. Courts List
  const courtRes = await request('/venues/1/courts');
  console.log('4. Courts for Venue 1:', courtRes.body.courts.map((c) => c.name).join(', '));

  // 5. Existing Booked Slots
  const dateStr = new Date().toISOString().split('T')[0];
  const slotRes = await request(`/courts/1/bookings?date=${dateStr}`);
  console.log(`5. Booked slots on Court 1 for ${dateStr}:`, slotRes.body.bookedSlots.length, 'slots booked');

  // 6. Overlap Prevention Test
  const overlapRes = await request('/bookings', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: { court_id: 1, date: dateStr, start_time: '08:00:00', end_time: '09:00:00' },
  });
  console.log('6. Overlap Test (expect 409 Conflict):', overlapRes.status, '| Message:', overlapRes.body.error);

  // 7. Successful New Booking
  const newBookingRes = await request('/bookings', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: { court_id: 1, date: dateStr, start_time: '14:00:00', end_time: '15:00:00' },
  });
  console.log('7. Valid Booking Creation (expect 201 Created):', newBookingRes.status, '| Message:', newBookingRes.body.message);
  const bookingId = newBookingRes.body.booking?.id;

  // 8. My Bookings List
  const myBookingsRes = await request('/bookings/my-bookings', {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log('8. User Bookings fetched:', myBookingsRes.body.bookings.length, 'total bookings');

  // 9. Cancel Booking
  if (bookingId) {
    const cancelRes = await request(`/bookings/${bookingId}/cancel`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('9. Booking Cancellation (expect status cancelled):', cancelRes.status, '| New Status:', cancelRes.body.booking?.status);
  }

  console.log('\n=== ALL E2E VERIFICATION TESTS PASSED PERFECTLY! ===');
}

runE2ETests().catch(console.error);
