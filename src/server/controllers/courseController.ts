
import { Request, Response } from 'express';
import Course from '../models/Course';
import User from '../models/User';
import mongoose from 'mongoose';

// Get all courses
export const getCourses = async (req: Request, res: Response): Promise<void> => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get course by ID
export const getCourseById = async (req: Request, res: Response): Promise<void> => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }

    res.status(200).json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new course
export const createCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, instructorId, thumbnail, duration, modules, category } = req.body;

    // Verify instructor exists
    const instructor = await User.findById(instructorId);
    if (!instructor || instructor.role !== 'instructor') {
      res.status(400).json({ message: 'Invalid instructor ID' });
      return;
    }

    const course = new Course({
      title,
      description,
      instructorId,
      instructorName: instructor.name,
      thumbnail,
      duration,
      modules: modules || [],
      enrolledStudents: [],
      category,
    });

    const savedCourse = await course.save();
    res.status(201).json(savedCourse);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update course
export const updateCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, thumbnail, duration, modules, category } = req.body;
    
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }

    // Check if the requesting user is the course instructor (in a real app, this would be middleware)
    if (req.body.userId && course.instructorId.toString() !== req.body.userId) {
      res.status(403).json({ message: 'Not authorized to update this course' });
      return;
    }

    course.title = title || course.title;
    course.description = description || course.description;
    course.thumbnail = thumbnail || course.thumbnail;
    course.duration = duration || course.duration;
    course.modules = modules || course.modules;
    course.category = category || course.category;
    course.updatedAt = new Date();

    const updatedCourse = await course.save();
    res.status(200).json(updatedCourse);
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Enroll student in course
export const enrollStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const courseId = req.params.id;
    const { userId } = req.body;

    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Check if already enrolled
    if (course.enrolledStudents.includes(new mongoose.Types.ObjectId(userId))) {
      res.status(400).json({ message: 'User already enrolled in this course' });
      return;
    }

    // Add student to course
    course.enrolledStudents.push(new mongoose.Types.ObjectId(userId));
    await course.save();

    res.status(200).json({ message: 'Student enrolled successfully' });
  } catch (error) {
    console.error('Error enrolling student:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
