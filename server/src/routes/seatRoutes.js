import express from 'express';
import { getSeats, getSeat, getSeatByQrId, createSeat, updateSeat, deleteSeat } from '../controllers/seatController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Look up a seat by its QR code ID (public, used by the passenger flow)
router.get('/qr/:qrId', getSeatByQrId);

router.route('/')
  .get(getSeats)
  .post(protect, admin, createSeat);

router.route('/:id')
  .get(getSeat)
  .put(protect, admin, updateSeat)
  .delete(protect, admin, deleteSeat);

export default router;
