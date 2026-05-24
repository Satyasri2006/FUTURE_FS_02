import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import connectDB from './config/db.js';

// Load environment variables
dotenv.config();

const seedAdmin = async () => {
  try {
    // 1. Establish connection
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('[Seeder] Database connection established.');

    // 2. Check for existing users
    const existingUser = await User.findOne({ email: 'admin@minicrm.com' });
    if (existingUser) {
      console.log('[Seeder] Admin Operator account already seeded in the database.');
      process.exit(0);
    }

    // 3. Create single admin profile
    // Note: The User model pre-save hook will automatically hash the password using bcryptjs!
    await User.create({
      name: 'Admin Operator',
      email: 'admin@minicrm.com',
      password: 'admin123'
    });

    console.log('\n======================================================');
    console.log('[Seeder] Starting Admin Operator successfully created!');
    console.log('Credentials:');
    console.log(' - Email: admin@minicrm.com');
    console.log(' - Password: admin123');
    console.log('======================================================\n');
    
    process.exit(0);
  } catch (error) {
    console.error(`[Seeder Error] Seeding operation failed: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();
