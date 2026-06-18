import express from 'express';
import { createCheckoutSession, cancelSubscription, getMySubscriptions, simulatePayment } from '../controllers/subscriptionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-checkout-session', protect, createCheckoutSession);
router.post('/cancel', protect, cancelSubscription);
router.get('/my-subscriptions', protect, getMySubscriptions);
router.post('/simulate', protect, simulatePayment);

export default router;