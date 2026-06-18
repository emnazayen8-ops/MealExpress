import express from 'express';
import { getMyOrders, getOrderById, createOrder, updateOrderStatus, getAllOrders } from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ Static routes MUST come before dynamic /:id routes
router.get('/my-orders', protect, getMyOrders);
router.get('/', protect, admin, getAllOrders);
router.post('/', protect, createOrder);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, admin, updateOrderStatus);

export default router;