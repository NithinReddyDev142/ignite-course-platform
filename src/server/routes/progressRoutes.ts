
import express from 'express';
import { 
  getStudentProgress, 
  updateLessonProgress, 
  submitQuizScore 
} from '../controllers/progressController';

const router = express.Router();

// GET progress for student in course
router.get('/:userId/:courseId', getStudentProgress);

// PUT update lesson progress
router.put('/:userId/:courseId/lesson', updateLessonProgress);

// POST submit quiz score
router.post('/:userId/:courseId/quiz', submitQuizScore);

export default router;
