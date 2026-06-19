import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const email = 'admin@mealexpress.tn';
    const password = 'password';
    
    const existing = await User.findOne({ email });
    if (existing) {
      console.log('Admin already exists');
      process.exit();
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    await User.create({
      name: 'Admin',
      email,
      password: hashedPassword,
      role: 'admin'
    });
    
    console.log('✅ Admin created successfully');
    process.exit();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

createAdmin();