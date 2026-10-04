import express from 'express';
import { createRequest, getRequests, getRequest, updateRequestStatus, getRequestByQrId, createGenericEmergency } from '../controllers/requestController.js';
import { protect, staff } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(createRequest)
  .get(getRequests);

// Generic emergency from the front page (no seat/auth required - any passenger can press SOS)
router.post('/emergency', createGenericEmergency);

router.route('/:id')
  .get(getRequest)
  .put(protect, staff, updateRequestStatus);

router.get('/qr/:qrId', getRequestByQrId);

export default router;
