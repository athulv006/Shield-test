import express from 'express';
import { getVenues, getVenue } from '../controllers/venueController.js';
import { getCourtsForVenue } from '../controllers/courtController.js';

const router = express.Router();

router.get('/', getVenues);
router.get('/:id', getVenue);
router.get('/:venueId/courts', getCourtsForVenue);

export default router;
