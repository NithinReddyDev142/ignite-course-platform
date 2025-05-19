
import express from 'express';
import { 
  getLearningPaths, 
  getLearningPathById, 
  createLearningPath, 
  updateLearningPath 
} from '../controllers/learningPathController';

const router = express.Router();

// GET all learning paths
router.get('/', getLearningPaths);

// GET learning path by ID
router.get('/:id', getLearningPathById);

// POST create new learning path
router.post('/', createLearningPath);

// PUT update learning path
router.put('/:id', updateLearningPath);

export default router;
