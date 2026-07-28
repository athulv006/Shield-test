import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import venueRoutes from './routes/venueRoutes.js';
import courtRoutes from './routes/courtRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import { runSeed } from './scripts/seed.js';
import { getDbStatus } from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/venues', venueRoutes);
app.use('/api/courts', courtRoutes);
app.use('/api/bookings', bookingRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    db: getDbStatus(),
  });
});

// Run seeding and start server
runSeed()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Badminton Court Booking API running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
    app.listen(PORT, () => {
      console.log(`Server starting on port ${PORT} despite seed warning`);
    });
  });
