
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lms';

export const connectDB = async (): Promise<void> => {
  try {
    console.log('Connecting to MongoDB with URI:', MONGODB_URI);
    
    // Add options to avoid deprecation warnings
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000 // Keep trying to send operations for 5 seconds
    });
    
    console.log('MongoDB connected successfully');
    console.log(`Connected to database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
