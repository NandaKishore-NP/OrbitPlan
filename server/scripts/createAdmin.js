import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Update this connection string according to your .env
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/OrbitPlan';

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  title: String,
  role: String,
  isAdmin: Boolean,
  isActive: Boolean,
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function createAdminUser() {
  try {
    await mongoose.connect(MONGO_URI);
    
    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@neartek.com' });
    
    if (adminExists) {
      console.log('Admin user already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@gmail.com',
      password: hashedPassword,
      title: 'Administrator',
      role: 'admin',
      isAdmin: true,
      isActive: true
    });

    console.log('Admin user created successfully:', adminUser.email);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

createAdminUser();