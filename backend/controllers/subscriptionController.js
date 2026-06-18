import Stripe from 'stripe';
import Box from '../models/Box.js';
import Subscription from '../models/Subscription.js';
import Order from '../models/Order.js';

const getStripe = () => {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
};

// ✅ Helper — build timeline manually to avoid pre('save') hook issues
const buildTimeline = () => [
  { status: 'confirmed', label: 'Order confirmed', description: 'Your order has been validated', completed: true, timestamp: new Date() },
  { status: 'preparing', label: 'Preparing', description: 'We are preparing your box', completed: false, timestamp: new Date() },
  { status: 'shipped', label: 'Shipped', description: 'Your box has left our warehouse', completed: false, timestamp: new Date() },
  { status: 'in_transit', label: 'In transit', description: 'Your box is on the way', completed: false, timestamp: new Date() },
  { status: 'delivered', label: 'Delivered', description: 'Your box has been delivered', completed: false, timestamp: new Date() }
];

export const createCheckoutSession = async (req, res) => {
  try {
    const stripeClient = getStripe();

    if (!stripeClient) {
      return res.status(400).json({ message: 'Stripe is not configured. Use the simulate endpoint instead.' });
    }

    const { boxId } = req.body;
    const box = await Box.findById(boxId);
    if (!box) return res.status(404).json({ message: 'Box not found' });

    const existing = await Subscription.findOne({ user: req.user._id, box: boxId, status: 'active' });
    if (existing) {
      return res.status(400).json({ message: 'You already have an active subscription for this box.' });
    }

    const session = await stripeClient.checkout.sessions.create({
      customer_email: req.user.email,
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: box.name, description: box.description },
          unit_amount: Math.round(box.price * 100),
          recurring: { interval: 'month' }
        },
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard?success=true`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/boxes?canceled=true`,
      metadata: { userId: req.user._id.toString(), boxId }
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Checkout session error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

export const stripeWebhook = async (req, res) => {
  const stripeClient = getStripe();
  if (!stripeClient) return res.status(400).json({ message: 'Stripe not configured' });

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripeClient.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET || '');
  } catch (err) {
    console.error('Webhook verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    try {
      const subscription = await Subscription.create({
        user: session.metadata.userId,
        box: session.metadata.boxId,
        stripeSubscriptionId: session.subscription || session.id,
        status: 'active'
      });

      // ✅ Build timeline manually — no pre('save') hook needed
      await Order.create({
        user: session.metadata.userId,
        subscription: subscription._id,
        box: session.metadata.boxId,
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        deliveryAddress: { street: '', city: '', postalCode: '', country: 'Tunisia' },
        timeline: buildTimeline()
      });

      console.log('✅ Subscription and order created via webhook');
    } catch (err) {
      console.error('❌ Error in webhook handler:', err.message);
    }
  }

  res.json({ received: true });
};

export const cancelSubscription = async (req, res) => {
  try {
    const stripeClient = getStripe();

    const subscription = await Subscription.findOne({ user: req.user._id, status: 'active' });
    if (!subscription) {
      return res.status(404).json({ message: 'No active subscription found' });
    }

    if (!subscription.stripeSubscriptionId.startsWith('simulated_') && stripeClient) {
      try {
        await stripeClient.subscriptions.cancel(subscription.stripeSubscriptionId);
      } catch (stripeErr) {
        console.log('Stripe cancel error:', stripeErr.message);
      }
    }

    subscription.status = 'canceled';
    await subscription.save();

    // ✅ Also cancel the linked order
    const order = await Order.findOne({ subscription: subscription._id });
    if (order && order.status !== 'delivered') {
      await Order.findByIdAndUpdate(
        order._id,
        { $set: { status: 'cancelled' } },
        { new: true }
      );
      console.log('✅ Order marked as cancelled');
    }

    res.json({ message: 'Subscription canceled successfully' });
  } catch (error) {
    console.error('Cancel error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getMySubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ user: req.user._id })
      .populate('box', 'name price image')
      .sort({ createdAt: -1 });
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const simulatePayment = async (req, res) => {
  try {
    const { boxId } = req.body;
    if (!boxId) return res.status(400).json({ message: 'boxId is required' });

    const box = await Box.findById(boxId);
    if (!box) return res.status(404).json({ message: 'Box not found' });

    const existing = await Subscription.findOne({ user: req.user._id, box: boxId, status: 'active' });
    if (existing) {
      return res.status(400).json({ message: 'You already have an active subscription for this box.' });
    }

    const subscription = await Subscription.create({
      user: req.user._id,
      box: boxId,
      stripeSubscriptionId: 'simulated_' + Date.now(),
      status: 'active'
    });

    // ✅ Build timeline manually
    const order = await Order.create({
      user: req.user._id,
      subscription: subscription._id,
      box: boxId,
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      deliveryAddress: { street: '', city: '', postalCode: '', country: 'Tunisia' },
      timeline: buildTimeline()
    });

    res.status(201).json({ message: 'Subscription and order created successfully (simulated)', subscription, order });
  } catch (error) {
    console.error('Simulate payment error:', error.message);
    res.status(500).json({ message: error.message });
  }
};