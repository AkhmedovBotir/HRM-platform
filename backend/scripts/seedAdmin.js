require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../src/models/Admin');

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: 'general' });

    if (existingAdmin) {
      console.log('Admin with username "general" already exists');
      await mongoose.connection.close();
      process.exit(0);
    }

    // Create new admin
    const admin = new Admin({
      username: 'general',
      password: 'general123',
    });

    await admin.save();
    console.log('Admin created successfully:');
    console.log('Username: general');
    console.log('Password: general123');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedAdmin();

