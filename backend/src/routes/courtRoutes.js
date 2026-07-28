import express from 'express';
import { getBookingsForCourtAndDate } from '../controllers/courtController.js';

const router = express.Router();

router.get('/:courtId/bookings', getBookingsForCourtAndDate);

export default router;
