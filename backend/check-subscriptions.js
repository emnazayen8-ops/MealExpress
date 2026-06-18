import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Subscription from './models/Subscription.js';

dotenv.config();

const check = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  
  const subs = await Subscription.find();
  subs.forEach(s => {
    console.log('ID:', s._id);
    console.log('Stripe ID:', s.stripeSubscriptionId);
    console.log('Status:', s.status);
    console.log('---');
  });
  
  process.exit();
};

check();