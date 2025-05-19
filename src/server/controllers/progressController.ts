
import { Request, Response } from 'express';
import Progress from '../models/Progress';
import Course from '../models/Course';
import mongoose from 'mongoose';

// Get progress for a student in a course
export const getStudentProgress = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, courseId } = req.params;

    const progress = await Progress.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      courseId: new mongoose.Types.ObjectId(courseId),
    });

    if (!progress) {
      res.status(404).json({ message: 'Progress not found' });
      return;
    }

    res.status(200).json(progress);
  } catch (error) {
    console.error('Error fetching student progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update lesson progress
export const updateLessonProgress = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, courseId } = req.params;
    const { lessonId } = req.body;

    // Find the course to calculate overall progress
    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }

    // Count total lessons in the course
    let totalLessons = 0;
    course.modules.forEach(module => {
      totalLessons += module.lessons.length;
    });

    // Find existing progress or create a new one
    let progress = await Progress.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      courseId: new mongoose.Types.ObjectId(courseId),
    });

    if (progress) {
      // Check if lesson is already completed
      if (!progress.completedLessons.includes(lessonId)) {
        progress.completedLessons.push(lessonId);
        progress.lastAccessedLesson = lessonId;
        
        // Update overall progress percentage
        progress.overallProgress = Math.round((progress.completedLessons.length / totalLessons) * 100);
        
        await progress.save();
      }
    } else {
      // Create new progress entry
      progress = new Progress({
        userId: new mongoose.Types.ObjectId(userId),
        courseId: new mongoose.Types.ObjectId(courseId),
        completedLessons: [lessonId],
        lastAccessedLesson: lessonId,
        quizScores: [],
        overallProgress: totalLessons > 0 ? Math.round((1 / totalLessons) * 100) : 0,
      });

      await progress.save();
    }

    res.status(200).json(progress);
  } catch (error) {
    console.error('Error updating lesson progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Submit quiz score
export const submitQuizScore = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, courseId } = req.params;
    const { quizId, score, totalQuestions } = req.body;

    // Find existing progress
    let progress = await Progress.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      courseId: new mongoose.Types.ObjectId(courseId),
    });

    if (!progress) {
      // Create new progress entry
      progress = new Progress({
        userId: new mongoose.Types.ObjectId(userId),
        courseId: new mongoose.Types.ObjectId(courseId),
        completedLessons: [],
        quizScores: [],
        overallProgress: 0,
      });
    }

    // Add quiz score
    const quizScore = {
      quizId,
      score,
      totalQuestions,
      completedAt: new Date().toISOString(),
    };

    // Check if quiz already taken, update score if it was
    const existingScoreIndex = progress.quizScores.findIndex(qs => qs.quizId === quizId);
    if (existingScoreIndex !== -1) {
      progress.quizScores[existingScoreIndex] = quizScore;
    } else {
      progress.quizScores.push(quizScore);
    }

    await progress.save();
    res.status(200).json(progress);
  } catch (error) {
    console.error('Error submitting quiz score:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
