import express from 'express';
import { createBooking, getMyBookings } from '../controllers/bookingController.js';
import { authenticate } from '../middleware/authMiddleware.js'

export const bookingRoute = express.Router();

bookingRoute.post('/', authenticate, createBooking);
bookingRoute.get('/', authenticate, getMyBookings);
