import express from 'express';
import { getCoaches, getCoach, createCoach, updateCoach, deleteCoach } from '../controllers/coachController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getCoaches)
  .post(protect, admin, createCoach);

router.route('/:id')
  .get(getCoach)
  .put(protect, admin, updateCoach)
  .delete(protect, admin, deleteCoach);

export default router;
