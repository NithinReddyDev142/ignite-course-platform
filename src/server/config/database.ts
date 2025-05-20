
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lms';

export const connectDB = async (): Promise<void> => {
  try {
    console.log('Attempting to connect to MongoDB...');
    
    // Hide credentials in logs while still showing the connection string structure
    const sanitizedUri = MONGODB_URI.replace(/mongodb\+srv:\/\/[^:]+:[^@]+@/, 'mongodb+srv://USERNAME:PASSWORD@');
    console.log('Using connection string:', sanitizedUri);
    
    // Add options to avoid deprecation warnings and improve connection reliability
    await mongoose.connect(MONGODB_URI);
    
    console.log('✅ MongoDB connected successfully');
    console.log(`Connected to database: ${mongoose.connection.name}`);
    
    // Set up connection event handlers for better monitoring
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
      } catch (err) {
        console.error('Error during MongoDB connection closure:', err);
        process.exit(1);
      }
    });
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error; // Re-throw to be handled by the caller
  }
};
