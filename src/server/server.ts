
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

// CORS configuration - Allow requests from any origin during development
app.use(cors({
  origin: '*', // In production, you should specify your frontend domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/learning-paths', learningPathRoutes);

// Root route
app.get('/', (_, res) => {
  res.send('LMS API is running...');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
