const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connStr = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cleannes';
    console.log(`Connecting to MongoDB...`);
    const conn = await mongoose.connect(connStr);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    console.log('Ensure MongoDB is installed and running, or provide a valid MONGO_URI in .env');
    // We will not exit the process, instead let it run so simulated db or retry logic can function
  }
};

module.exports = connectDB;
