import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Course, StudentProgress, LearningPath } from "@/lib/types";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

interface AppContextType {
  courses: Course[];
  myCourses: Course[];
  learningPaths: LearningPath[];
  studentProgress: StudentProgress[];
  loading: boolean;
  error: string | null;
  getCourseById: (id: string) => Course | undefined;
  getProgressForCourse: (courseId: string) => StudentProgress | undefined;
  enrollInCourse: (courseId: string) => void;
  updateProgress: (courseId: string, lessonId: string) => void;
  createCourse: (course: Partial<Course>) => void;
  getLearningPathById: (id: string) => LearningPath | undefined;
  createLearningPath: (path: Partial<LearningPath>) => void;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Use the same API base URL as in AuthContext
const API_BASE_URL = 'http://localhost:5000/api';

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [studentProgress, setStudentProgress] = useState<StudentProgress[]>([]);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filtered courses based on role and enrollment
  const myCourses = currentUser
    ? currentUser.role === "instructor"
      ? courses.filter(course => course.instructorId === currentUser.id)
      : courses.filter(course => course.enrolledStudents.includes(currentUser.id))
    : [];

  // Fetch data from API
  const fetchCourses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/courses`);
      if (!response.ok) throw new Error('Failed to fetch courses');
      const data = await response.json();
      setCourses(data);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch courses');
    }
  };

  const fetchLearningPaths = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/learning-paths`);
      if (!response.ok) throw new Error('Failed to fetch learning paths');
      const data = await response.json();
      setLearningPaths(data);
    } catch (err) {
      console.error('Error fetching learning paths:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch learning paths');
    }
  };

  const fetchUserProgress = async () => {
    if (!currentUser) return;
    
    try {
      // For each enrolled course, fetch progress
      const progressPromises = myCourses.map(async (course) => {
        const response = await fetch(`${API_BASE_URL}/progress/${currentUser.id}/${course.id}`);
        if (!response.ok) return null; // No progress yet is fine
        return response.json();
      });
      
      const progressResults = await Promise.all(progressPromises);
      setStudentProgress(progressResults.filter(Boolean));
    } catch (err) {
      console.error('Error fetching user progress:', err);
    }
  };

  // Initial data fetch
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      await fetchCourses();
      await fetchLearningPaths();
      setLoading(false);
    };
    
    loadInitialData();
  }, []);

  // Fetch user's progress when user or courses change
  useEffect(() => {
    if (currentUser && courses.length > 0) {
      fetchUserProgress();
    }
  }, [currentUser, courses]);

  const refreshData = async () => {
    setLoading(true);
    await fetchCourses();
    await fetchLearningPaths();
    if (currentUser) {
      await fetchUserProgress();
    }
    setLoading(false);
  };

  const getCourseById = (id: string) => {
    return courses.find(course => course.id === id);
  };

  const getLearningPathById = (id: string) => {
    return learningPaths.find(path => path.id === id);
  };

  const getProgressForCourse = (courseId: string) => {
    if (!currentUser) return undefined;
    return studentProgress.find(
      progress => progress.courseId === courseId && progress.userId === currentUser.id
    );
  };

  const enrollInCourse = async (courseId: string) => {
    if (!currentUser) {
      toast.error("You must be logged in to enroll in a course");
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/courses/${courseId}/enroll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: currentUser.id }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to enroll in course');
      }
      
      // Update local state after successful enrollment
      setCourses(prevCourses => 
        prevCourses.map(course => {
          if (course.id === courseId) {
            return {
              ...course,
              enrolledStudents: [...course.enrolledStudents, currentUser.id]
            };
          }
          return course;
        })
      );
      
      toast.success(`Successfully enrolled in course`);
      
      // Refresh progress data
      await fetchUserProgress();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to enroll in course");
      toast.error(err instanceof Error ? err.message : "Failed to enroll in course");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (courseId: string, lessonId: string) => {
    if (!currentUser) return;

    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/progress/${currentUser.id}/${courseId}/lesson`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lessonId }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update progress');
      }
      
      const updatedProgress = await response.json();
      
      // Update local state
      setStudentProgress(prev => 
        prev.map(progress => 
          progress.userId === currentUser.id && progress.courseId === courseId
            ? updatedProgress
            : progress
        )
      );
      
      // If this is a new progress entry, add it to the array
      if (!studentProgress.some(p => p.userId === currentUser.id && p.courseId === courseId)) {
        setStudentProgress(prev => [...prev, updatedProgress]);
      }
      
      toast.success("Progress updated successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update progress");
      toast.error("Failed to update progress");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createCourse = async (courseData: Partial<Course>) => {
    if (!currentUser || currentUser.role !== "instructor") {
      toast.error("You must be an instructor to create courses");
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...courseData,
          instructorId: currentUser.id,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create course');
      }
      
      const newCourse = await response.json();
      setCourses(prevCourses => [...prevCourses, newCourse]);
      toast.success(`Course "${newCourse.title}" created successfully`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create course");
      toast.error("Failed to create course");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createLearningPath = async (pathData: Partial<LearningPath>) => {
    if (!currentUser || currentUser.role !== "instructor") {
      toast.error("You must be an instructor to create learning paths");
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/learning-paths`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...pathData,
          createdBy: currentUser.id,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create learning path');
      }
      
      const newPath = await response.json();
      setLearningPaths(prevPaths => [...prevPaths, newPath]);
      toast.success(`Learning path "${newPath.title}" created successfully`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create learning path");
      toast.error("Failed to create learning path");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <AppContext.Provider 
      value={{ 
        courses, 
        myCourses, 
        learningPaths, 
        studentProgress, 
        loading, 
        error, 
        getCourseById, 
        getProgressForCourse, 
        enrollInCourse,
        updateProgress,
        createCourse,
        getLearningPathById,
        createLearningPath,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
