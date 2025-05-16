
export type UserRole = 'instructor' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  instructorName: string;
  thumbnail: string;
  duration: string;
  modules: Module[];
  enrolledStudents: string[];
  rating?: number;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  videoUrl?: string;
  duration: string;
  quizzes?: Quiz[];
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
}

export interface StudentProgress {
  userId: string;
  courseId: string;
  completedLessons: string[];
  lastAccessedLesson?: string;
  quizScores: QuizScore[];
  overallProgress: number; // Percentage 0-100
}

export interface QuizScore {
  quizId: string;
  score: number;
  totalQuestions: number;
  completedAt: string;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  courses: string[];
  createdBy: string;
}
