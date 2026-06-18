import express from 'express';
import { getBoxes, getBoxById, createBox, updateBox, deleteBox } from '../controllers/boxController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getBoxes);
router.get('/:id', getBoxById);
router.post('/', protect, admin, upload.single('image'), createBox);
router.put('/:id', protect, admin, upload.single('image'), updateBox);
router.delete('/:id', protect, admin, deleteBox);

export default router;