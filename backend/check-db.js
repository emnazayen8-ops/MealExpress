import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Box from './models/Box.js';
import Product from './models/Product.js';

dotenv.config();

const check = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  
  console.log('=== BOXES ===');
  const boxes = await Box.find();
  boxes.forEach(b => {
    console.log(`Name: ${b.name}`);
    console.log(`Image: ${b.image}`);
    console.log('---');
  });
  
  console.log('=== PRODUCTS ===');
  const products = await Product.find();
  products.forEach(p => {
    console.log(`Name: ${p.name}`);
    console.log(`Image: ${p.image}`);
    console.log('---');
  });
  
  process.exit();
};

check();