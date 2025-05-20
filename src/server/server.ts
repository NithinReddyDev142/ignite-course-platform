
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/database';
import userRoutes from './routes/userRoutes';
import courseRoutes from './routes/courseRoutes';
import progressRoutes from './routes/progressRoutes';
import learningPathRoutes from './routes/learningPathRoutes';

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Enhanced CORS configuration to accept requests from Lovable preview domains
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://localhost:5173', 
    /\.lovableproject\.com$/,
    /\.app\.github\.dev$/
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

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
import User from './models/User';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

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

export default app;
