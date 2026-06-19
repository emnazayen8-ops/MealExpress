import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const resetPassword = async () => {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    
    const { default: User } = await import('./models/User.js');
    
    const newPassword = 'admin123456'; // ← Change ce mot de passe si tu veux
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    const user = await User.findOneAndUpdate(
      { email: 'admin@mealexpress.tn' },
      { password: hashedPassword },
      { new: true }
    );
    
    if (!user) {
      console.log('❌ Admin not found in database');
      process.exit(1);
    }
    
    console.log('✅ Password reset successfully!');
    console.log('📧 Email:', user.email);
    console.log('🔑 New password:', newPassword);
    console.log('🎭 Role:', user.role);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

resetPassword();