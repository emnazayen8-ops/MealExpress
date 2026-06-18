import express from 'express';
import { sendMessage, getMessages, markAsRead, deleteMessage } from '../controllers/contactController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', sendMessage);
router.get('/', protect, admin, getMessages);
router.put('/:id/read', protect, admin, markAsRead);
router.delete('/:id', protect, admin, deleteMessage);

export default router;