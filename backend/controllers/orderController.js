import Order from '../models/Order.js';
import Subscription from '../models/Subscription.js';

const buildTimeline = () => [
  { status: 'confirmed', label: 'Order confirmed', description: 'Your order has been validated', completed: true, timestamp: new Date() },
  { status: 'preparing', label: 'Preparing', description: 'We are preparing your box', completed: false, timestamp: new Date() },
  { status: 'shipped', label: 'Shipped', description: 'Your box has left our warehouse', completed: false, timestamp: new Date() },
  { status: 'in_transit', label: 'In transit', description: 'Your box is on the way', completed: false, timestamp: new Date() },
  { status: 'delivered', label: 'Delivered', description: 'Your box has been delivered', completed: false, timestamp: new Date() }
];

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('box', 'name price image')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('box', 'name price image');

    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { subscriptionId, deliveryAddress } = req.body;

    const subscription = await Subscription.findById(subscriptionId).populate('box');
    if (!subscription) return res.status(404).json({ message: 'Subscription not found' });

    if (subscription.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const order = await Order.create({
      user: req.user._id,
      subscription: subscriptionId,
      box: subscription.box._id,
      deliveryAddress: deliveryAddress || {},
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      timeline: buildTimeline()
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingNumber, carrier } = req.body;
    console.log('Updating order:', req.params.id, '→ status:', status);

    const statusOrder = ['confirmed', 'preparing', 'shipped', 'in_transit', 'delivered'];
    const targetIdx = statusOrder.indexOf(status);

    const updateFields = {};

    if (status) {
      updateFields.status = status;
      updateFields.timeline = statusOrder.map((s, i) => ({
        status: s,
        label: { confirmed: 'Order confirmed', preparing: 'Preparing', shipped: 'Shipped', in_transit: 'In transit', delivered: 'Delivered' }[s],
        description: { confirmed: 'Your order has been validated', preparing: 'We are preparing your box', shipped: 'Your box has left our warehouse', in_transit: 'Your box is on the way', delivered: 'Your box has been delivered' }[s],
        completed: i <= targetIdx,
        timestamp: new Date()
      }));
    }

    if (trackingNumber) updateFields.trackingNumber = trackingNumber;
    if (carrier) updateFields.carrier = carrier;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    ).populate('box', 'name price image');

    if (!updatedOrder) return res.status(404).json({ message: 'Order not found' });

    console.log('✅ Order updated:', updatedOrder._id, '→', updatedOrder.status);
    res.json(updatedOrder);
  } catch (error) {
    console.error('❌ updateOrderStatus error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('box', 'name price')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};