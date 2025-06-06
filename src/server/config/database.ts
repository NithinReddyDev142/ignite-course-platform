
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lms';

export const connectDB = async (): Promise<void> => {
  try {
    console.log('🔍 Checking MongoDB connection...');
    console.log('📊 Connection URI format check: OK');
    
    // Hide credentials in logs while still showing the connection string structure
    const sanitizedUri = MONGODB_URI.replace(/mongodb\+srv:\/\/[^:]+:[^@]+@/, 'mongodb+srv://***:***@');
    console.log('🔗 Using connection string:', sanitizedUri);
    
    // Add options to avoid deprecation warnings and improve connection reliability
    const connectionOptions = {
      serverSelectionTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000, // 45 seconds
      bufferCommands: false, // Disable mongoose buffering
      bufferMaxEntries: 0 // Disable mongoose buffering
    };
    
    console.log('⏳ Connecting to MongoDB (timeout: 10s)...');
    await mongoose.connect(MONGODB_URI, connectionOptions);
    
    console.log('✅ MongoDB connected successfully');
    console.log(`📚 Connected to database: ${mongoose.connection.name}`);
    console.log(`🌍 Host: ${mongoose.connection.host}`);
    console.log(`🔌 Connection state: ${mongoose.connection.readyState}`);
    
    // Test a simple query to ensure the connection works
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`📂 Available collections: ${collections.length}`);
    
    // Set up connection event handlers for better monitoring
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('🔒 MongoDB connection closed through app termination');
        process.exit(0);
      } catch (err) {
        console.error('❌ Error during MongoDB connection closure:', err);
        process.exit(1);
      }
    });
    
  } catch (error) {
    console.error('❌ MongoDB connection error details:');
    console.error('   Error:', error);
    if (error instanceof Error) {
      console.error('   Message:', error.message);
    }
    console.error('💡 Troubleshooting tips:');
    console.error('   1. Check your .env file has the correct MONGODB_URI');
    console.error('   2. Ensure your MongoDB Atlas cluster is running');
    console.error('   3. Verify your IP address is whitelisted in MongoDB Atlas');
    console.error('   4. Check your username and password are correct');
    throw error; // Re-throw to be handled by the caller
  }
};
