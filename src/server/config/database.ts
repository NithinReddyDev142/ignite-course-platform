
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lms';

export const connectDB = async (): Promise<void> => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('Using connection string:', MONGODB_URI.replace(/mongodb\+srv:\/\/[^:]+:[^@]+@/, 'mongodb+srv://USERNAME:PASSWORD@')); // Hide credentials in logs
    
    // Add options to avoid deprecation warnings and improve connection
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // Increase timeout for server selection
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });
    
    console.log('✅ MongoDB connected successfully');
    console.log(`Connected to database: ${mongoose.connection.name}`);
    
    // Set up connection event handlers for better monitoring
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};
