import express from 'express';
import { getStaff, createStaff, updateStaff, deleteStaff } from '../controllers/staffController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, admin, getStaff)
  .post(protect, admin, createStaff);

router.route('/:id')
  .put(protect, admin, updateStaff)
  .delete(protect, admin, deleteStaff);

export default router;
