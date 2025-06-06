
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

console.log('🚀 Initializing LMS Server...');
console.log('📊 Node version:', process.version);
console.log('🌍 Environment:', process.env.NODE_ENV || 'development');

// Connect to MongoDB - this will be awaited to ensure connection before starting the server
(async () => {
  try {
    console.log('🔗 Attempting to connect to MongoDB...');
    await connectDB();
    console.log('✅ MongoDB connection successful!');
    
    const app = express();
    const PORT = process.env.PORT || 5000;

    // Enhanced CORS configuration
    app.use(cors({
      origin: [
        'http://localhost:5173', 
        'https://id-preview--95435341-9712-48d3-886a-854405143a1f.lovable.app',
        'https://95435341-9712-48d3-886a-854405143a1f.lovableproject.com'
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true
    }));

    // Body parsing middleware
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true }));

    // Request logging middleware
    app.use((req: Request, res: Response, next: NextFunction) => {
      console.log(`📡 ${new Date().toISOString()} - ${req.method} ${req.path}`);
      if (req.body && Object.keys(req.body).length > 0) {
        console.log('📦 Request body:', req.body);
      }
      next();
    });

    // API Routes - These must come BEFORE any catch-all routes
    app.use('/api/users', userRoutes);
    app.use('/api/courses', courseRoutes);
    app.use('/api/progress', progressRoutes);
    app.use('/api/learning-paths', learningPathRoutes);

    // Health check endpoint
    app.get('/api/health', (req: Request, res: Response) => {
      const healthStatus = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        mongoConnection: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        mongoState: mongoose.connection.readyState,
        database: mongoose.connection.name,
        server: 'LMS Backend API v1.0'
      };
      console.log('🏥 Health check requested:', healthStatus);
      res.json(healthStatus);
    });

    // Root endpoint
    app.get('/', (req: Request, res: Response) => {
      res.json({
        message: 'LMS API Server is running successfully! 🎉',
        timestamp: new Date().toISOString(),
        endpoints: [
          'GET /api/health - Health check',
          'POST /api/users/login - User login',
          'POST /api/users - Create user',
          'GET /api/users - Get all users',
          'GET /api/courses - Get all courses',
          'GET /api/learning-paths - Get all learning paths'
        ],
        mongoConnection: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        database: mongoose.connection.name
      });
    });

    // Error handling middleware
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      console.error('❌ Server error:', err);
      res.status(500).json({ 
        message: 'Internal server error', 
        error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
        timestamp: new Date().toISOString()
      });
    });

    // 404 handler for unmatched routes
    app.use((req: Request, res: Response) => {
      console.log(`❌ 404 - Route not found: ${req.method} ${req.path}`);
      res.status(404).json({ 
        message: 'Route not found',
        path: req.path,
        method: req.method,
        timestamp: new Date().toISOString()
      });
    });

    // Create test users function
    const createTestUsers = async () => {
      try {
        console.log('👥 Creating test users...');
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
          const userExists = await User.findOne({ email: userData.email });
          if (!userExists) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(userData.password, salt);
            
            await User.create({
              ...userData,
              password: hashedPassword
            });
            console.log(`✅ Test user created: ${userData.email} (${userData.role})`);
          } else {
            console.log(`ℹ️  Test user already exists: ${userData.email}`);
          }
        }
        console.log('👥 Test users setup complete!');
      } catch (error) {
        console.error('❌ Error creating test users:', error);
      }
    };

    // Start server
    app.listen(PORT, () => {
      console.log('🎉 ================================');
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 API available at http://localhost:${PORT}/api`);
      console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🌐 Frontend should connect to: http://localhost:${PORT}`);
      console.log('🎉 ================================');
      
      // Create test users after server starts
      createTestUsers();
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    console.error('💡 Common issues:');
    console.error('   - Check MongoDB connection string in .env');
    console.error('   - Ensure MongoDB Atlas allows connections from your IP');
    console.error('   - Verify your MongoDB credentials are correct');
    process.exit(1);
  }
})();

export { };
