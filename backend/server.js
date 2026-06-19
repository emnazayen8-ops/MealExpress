import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import boxRoutes from './routes/boxRoutes.js';
import productRoutes from './routes/productRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import { stripeWebhook } from './controllers/subscriptionController.js';

await connectDB();

const app = express();

app.use(cors({
  origin: [
    'https://meal-express-chi.vercel.app',
    'https://meal-express-hhmzuk9x2-meal-express.vercel.app',
    'http://localhost:5173'
  ],
  credentials: true
}));

// Stripe webhook MUST come before express.json()
app.post(
  '/api/subscriptions/webhook',
  express.raw({ type: 'application/json' }),
  (req, res, next) => {
    Promise.resolve(stripeWebhook(req, res, next)).catch(next);
  }
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/boxes', boxRoutes);
app.use('/api/products', productRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'MealExpress API is running 🚀',
    env: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});