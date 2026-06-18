import mongoose from 'mongoose';

const timelineSchema = new mongoose.Schema({
  status: String,
  label: String,
  description: String,
  timestamp: { type: Date, default: Date.now },
  completed: { type: Boolean, default: false }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subscription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription',
    required: true
  },
  box: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Box',
    required: true
  },
  status: {
    type: String,
    enum: ['confirmed', 'preparing', 'shipped', 'in_transit', 'delivered', 'cancelled'],
    default: 'confirmed'
  },
  trackingNumber: { type: String, default: '' },
  carrier: { type: String, default: 'MealExpress Delivery' },
  estimatedDelivery: { type: Date },
  deliveryAddress: {
    street: { type: String, default: '' },
    city: { type: String, default: '' },
    postalCode: { type: String, default: '' },
    country: { type: String, default: 'Tunisia' }
  },
  timeline: [timelineSchema]
}, { timestamps: true });

// ✅ NO pre('save') hook — timeline is built manually in each controller

const Order = mongoose.model('Order', orderSchema);
export default Order;