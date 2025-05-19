
import { Request, Response } from 'express';
import LearningPath from '../models/LearningPath';
import Course from '../models/Course';
import User from '../models/User';
import mongoose from 'mongoose';

// Get all learning paths
export const getLearningPaths = async (req: Request, res: Response): Promise<void> => {
  try {
    const learningPaths = await LearningPath.find();
    res.status(200).json(learningPaths);
  } catch (error) {
    console.error('Error fetching learning paths:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get learning path by ID
export const getLearningPathById = async (req: Request, res: Response): Promise<void> => {
  try {
    const learningPath = await LearningPath.findById(req.params.id);
    
    if (!learningPath) {
      res.status(404).json({ message: 'Learning path not found' });
      return;
    }

    res.status(200).json(learningPath);
  } catch (error) {
    console.error('Error fetching learning path:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new learning path
export const createLearningPath = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, courses, createdBy } = req.body;

    // Verify creator exists and is an instructor
    const instructor = await User.findById(createdBy);
    if (!instructor || instructor.role !== 'instructor') {
      res.status(400).json({ message: 'Only instructors can create learning paths' });
      return;
    }

    // Verify all courses exist
    if (courses && courses.length > 0) {
      for (const courseId of courses) {
        const courseExists = await Course.exists({ _id: courseId });
        if (!courseExists) {
          res.status(400).json({ message: `Course with ID ${courseId} does not exist` });
          return;
        }
      }
    }

    const learningPath = new LearningPath({
      title,
      description,
      courses: courses || [],
      createdBy,
    });

    const savedPath = await learningPath.save();
    res.status(201).json(savedPath);
  } catch (error) {
    console.error('Error creating learning path:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update learning path
export const updateLearningPath = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, courses } = req.body;
    
    // Verify all courses exist if provided
    if (courses && courses.length > 0) {
      for (const courseId of courses) {
        const courseExists = await Course.exists({ _id: courseId });
        if (!courseExists) {
          res.status(400).json({ message: `Course with ID ${courseId} does not exist` });
          return;
        }
      }
    }
    
    const learningPath = await LearningPath.findById(req.params.id);
    
    if (!learningPath) {
      res.status(404).json({ message: 'Learning path not found' });
      return;
    }

    // Check if the requesting user is the creator (in a real app, this would be middleware)
    if (req.body.userId && learningPath.createdBy.toString() !== req.body.userId) {
      res.status(403).json({ message: 'Not authorized to update this learning path' });
      return;
    }

    if (title) learningPath.title = title;
    if (description) learningPath.description = description;
    if (courses) learningPath.courses = courses.map(id => new mongoose.Types.ObjectId(id));

    const updatedPath = await learningPath.save();
    res.status(200).json(updatedPath);
  } catch (error) {
    console.error('Error updating learning path:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
