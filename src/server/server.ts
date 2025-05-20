
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { connectDB } from './config/database';
import userRoutes from './routes/userRoutes';
import courseRoutes from './routes/courseRoutes';
import progressRoutes from './routes/progressRoutes';
import learningPathRoutes from './routes/learningPathRoutes';
import bcrypt from 'bcryptjs';
import User from './models/User';

// Connect to MongoDB - this will be awaited to ensure connection before starting the server
(async () => {
  try {
    await connectDB();
    
    const app = express();
    const PORT = process.env.PORT || 5000;

    // Enhanced CORS configuration with proper error handling
    app.use(cors({
      origin: '*', // Allow all origins temporarily for testing
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true
    }));

    app.use(express.json());

    // Add error handling middleware
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      console.error('Global error handler:', err);
      res.status(500).json({ message: 'Internal server error', error: err.message });
    });

    // Routes
    app.use('/api/users', userRoutes);
    app.use('/api/courses', courseRoutes);
    app.use('/api/progress', progressRoutes);
    app.use('/api/learning-paths', learningPathRoutes);

    // Root route for testing API health
    app.get('/', (_, res) => {
      res.send({
        status: 'online',
        message: 'LMS API is running',
        mongoConnection: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        time: new Date().toISOString()
      });
    });

    // Create test users on server start
    const createTestUsers = async () => {
      try {
        const testUsers = [
          {
            name: 'John Student',
            email: 'student@example.com',
            password: 'password123',
            role: 'student'
          },
          {
            name: 'Jane Instructor',
            email: 'instructor@example.com',
            password: 'password123',
            role: 'instructor'
          }
        ];
        
        for (const userData of testUsers) {
          // Check if user already exists
          const userExists = await User.findOne({ email: userData.email });
          if (!userExists) {
            // Hash the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(userData.password, salt);
            
            // Create the user
            await User.create({
              ...userData,
              password: hashedPassword
            });
            console.log(`Test user created: ${userData.email} (${userData.role})`);
          } else {
            console.log(`Test user already exists: ${userData.email}`);
          }
        }
      } catch (error) {
        console.error('Error creating test users:', error);
      }
    };

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API available at http://localhost:${PORT}/api`);
      
      // Create test users after server starts
      createTestUsers();
    });
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();

export { };
