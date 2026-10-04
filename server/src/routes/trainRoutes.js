import express from 'express';
import { getTrains, getTrain, createTrain, updateTrain, deleteTrain } from '../controllers/trainController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getTrains)
  .post(protect, admin, createTrain);

router.route('/:id')
  .get(getTrain)
  .put(protect, admin, updateTrain)
  .delete(protect, admin, deleteTrain);

export default router;
