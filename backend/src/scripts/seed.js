import { query } from '../config/db.js';

export async function runSeed() {
  console.log('--- Starting Database Schema Creation & Seeding ---');

  // Create Users table
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      phone_number VARCHAR(30) UNIQUE NOT NULL,
      name VARCHAR(100) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create Venues table
  await query(`
    CREATE TABLE IF NOT EXISTS venues (
      id SERIAL PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      latitude NUMERIC(10, 6) NOT NULL,
      longitude NUMERIC(10, 6) NOT NULL,
      address TEXT NOT NULL
    );
  `);

  // Create Courts table
  await query(`
    CREATE TABLE IF NOT EXISTS courts (
      id SERIAL PRIMARY KEY,
      venue_id INT NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
      name VARCHAR(50) NOT NULL
    );
  `);

  // Create Bookings table
  await query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      court_id INT NOT NULL REFERENCES courts(id) ON DELETE CASCADE,
      user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      date DATE NOT NULL,
      start_time TIME NOT NULL,
      end_time TIME NOT NULL,
      status VARCHAR(20) DEFAULT 'confirmed',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Check if venues exist
  const existingVenues = await query('SELECT COUNT(*)::int as count FROM venues');
  if (existingVenues.rows[0].count > 0) {
    console.log('Database already seeded. Skipping initial data population.');
    return;
  }

  // Seed Venues
  console.log('Seeding fake badminton venues...');
  await query(`
    INSERT INTO venues (id, name, latitude, longitude, address) VALUES
    (1, 'Smash Arena Badminton Club', 12.978000, 77.601000, '124 Indiranagar 100ft Rd, Bengaluru'),
    (2, 'Apex Pro Shuttle Hub', 12.935200, 77.624500, '45 Koramangala 8th Block, Bengaluru'),
    (3, 'Rally Point Sports Complex', 12.990000, 77.570000, '89 Malleshwaram 18th Cross, Bengaluru');
  `);

  // Seed Courts
  console.log('Seeding courts for each venue...');
  await query(`
    INSERT INTO courts (id, venue_id, name) VALUES
    (1, 1, 'Court A'),
    (2, 1, 'Court B'),
    (3, 1, 'Court C'),
    (4, 2, 'Court A'),
    (5, 2, 'Court B'),
    (6, 2, 'Court C'),
    (7, 3, 'Court A'),
    (8, 3, 'Court B');
  `);

  // Seed Initial Demo User
  console.log('Seeding demo user...');
  await query(`
    INSERT INTO users (id, phone_number, name) VALUES
    (1, '+15550192834', 'Alex Morgan');
  `);

  // Seed Initial Bookings for testing
  const todayStr = new Date().toISOString().split('T')[0];
  console.log(`Seeding sample confirmed bookings for date: ${todayStr}...`);
  await query(`
    INSERT INTO bookings (court_id, user_id, date, start_time, end_time, status) VALUES
    (1, 1, '${todayStr}', '08:00', '09:00', 'confirmed'),
    (1, 1, '${todayStr}', '18:00', '19:00', 'confirmed'),
    (4, 1, '${todayStr}', '19:00', '20:00', 'confirmed');
  `);

  console.log('--- Database Seeding Completed Successfully! ---');
}

// Run directly if called as a CLI script
if (process.argv[1].endsWith('seed.js')) {
  runSeed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Seeding failed:', err);
      process.exit(1);
    });
}
