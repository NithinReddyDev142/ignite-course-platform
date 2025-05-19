
import express from 'express';
import { 
  getCourses, 
  getCourseById, 
  createCourse, 
  updateCourse, 
  enrollStudent 
} from '../controllers/courseController';

const router = express.Router();

// GET all courses
router.get('/', getCourses);

// GET course by ID
router.get('/:id', getCourseById);

// POST create new course
router.post('/', createCourse);

// PUT update course
router.put('/:id', updateCourse);

// POST enroll student in course
router.post('/:id/enroll', enrollStudent);

export default router;
