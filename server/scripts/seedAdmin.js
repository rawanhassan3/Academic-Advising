const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config({ path: './.env' });

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const adminEmail = 'admin@cs.msa.edu.eg';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    const admin = new User({
      name: 'System Admin',
      email: adminEmail,
      password: 'AdminPassword123!', // You should change this after first login
      role: 'admin',
    });

    await admin.save();
    console.log('Admin user created successfully');
    console.log('Email: admin@cs.msa.edu.eg');
    console.log('Password: AdminPassword123!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
