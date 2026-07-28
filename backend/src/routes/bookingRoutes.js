import express from 'express';
import { createBooking, getMyBookings, cancelBooking } from '../controllers/bookingController.js';
import { authenticate } from '../controllers/authController.js';

const router = express.Router();

router.use(authenticate);

router.post('/', createBooking);
router.get('/my-bookings', getMyBookings);
router.patch('/:id/cancel', cancelBooking);

export default router;
