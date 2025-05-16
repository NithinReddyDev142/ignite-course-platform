
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Course, StudentProgress, LearningPath } from "@/lib/types";
import { sampleCourses, sampleStudentProgress, sampleLearningPaths } from "@/lib/sample-data";
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser } = useAuth();
  const [courses, setCourses] = useState<Course[]>(sampleCourses);
  const [studentProgress, setStudentProgress] = useState<StudentProgress[]>(sampleStudentProgress);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>(sampleLearningPaths);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filtered courses based on role and enrollment
  const myCourses = currentUser
    ? currentUser.role === "instructor"
      ? courses.filter(course => course.instructorId === currentUser.id)
      : courses.filter(course => course.enrolledStudents.includes(currentUser.id))
    : [];

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

  const enrollInCourse = (courseId: string) => {
    if (!currentUser) {
      toast.error("You must be logged in to enroll in a course");
      return;
    }

    setLoading(true);
    
    try {
      // Update the course
      setCourses(prevCourses => 
        prevCourses.map(course => {
          if (course.id === courseId) {
            // Check if already enrolled
            if (course.enrolledStudents.includes(currentUser.id)) {
              toast.info("You are already enrolled in this course");
              return course;
            }
            
            const updatedCourse = {
              ...course,
              enrolledStudents: [...course.enrolledStudents, currentUser.id]
            };
            
            // Create new progress entry
            const newProgress: StudentProgress = {
              userId: currentUser.id,
              courseId,
              completedLessons: [],
              overallProgress: 0,
              quizScores: []
            };
            
            setStudentProgress(prev => [...prev, newProgress]);
            toast.success(`Successfully enrolled in "${course.title}"`);
            
            return updatedCourse;
          }
          return course;
        })
      );
    } catch (err) {
      setError("Failed to enroll in course");
      toast.error("Failed to enroll in course");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = (courseId: string, lessonId: string) => {
    if (!currentUser) return;

    setLoading(true);
    
    try {
      // Find existing progress or create new one
      const existingProgress = studentProgress.find(
        p => p.userId === currentUser.id && p.courseId === courseId
      );
      
      if (existingProgress) {
        // Update existing progress
        setStudentProgress(prevProgress => 
          prevProgress.map(progress => {
            if (progress.userId === currentUser.id && progress.courseId === courseId) {
              // Check if lesson already completed
              if (progress.completedLessons.includes(lessonId)) {
                return progress;
              }
              
              // Add to completed lessons
              const updatedCompletedLessons = [...progress.completedLessons, lessonId];
              
              // Calculate new overall progress
              const course = courses.find(c => c.id === courseId);
              let totalLessons = 0;
              if (course) {
                course.modules.forEach(module => {
                  totalLessons += module.lessons.length;
                });
              }
              
              const newOverallProgress = totalLessons > 0
                ? Math.round((updatedCompletedLessons.length / totalLessons) * 100)
                : 0;
              
              toast.success("Progress updated successfully");
              
              return {
                ...progress,
                completedLessons: updatedCompletedLessons,
                lastAccessedLesson: lessonId,
                overallProgress: newOverallProgress
              };
            }
            return progress;
          })
        );
      } else {
        // Create new progress entry
        const course = courses.find(c => c.id === courseId);
        let totalLessons = 0;
        if (course) {
          course.modules.forEach(module => {
            totalLessons += module.lessons.length;
          });
        }
        
        const newProgress: StudentProgress = {
          userId: currentUser.id,
          courseId,
          completedLessons: [lessonId],
          lastAccessedLesson: lessonId,
          overallProgress: totalLessons > 0 ? Math.round((1 / totalLessons) * 100) : 0,
          quizScores: []
        };
        
        setStudentProgress(prev => [...prev, newProgress]);
        toast.success("Progress started for this course");
      }
    } catch (err) {
      setError("Failed to update progress");
      toast.error("Failed to update progress");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createCourse = (courseData: Partial<Course>) => {
    if (!currentUser || currentUser.role !== "instructor") {
      toast.error("You must be an instructor to create courses");
      return;
    }

    setLoading(true);
    
    try {
      const newCourse: Course = {
        id: `course${courses.length + 1}`,
        title: courseData.title || "Untitled Course",
        description: courseData.description || "No description provided",
        instructorId: currentUser.id,
        instructorName: currentUser.name,
        thumbnail: courseData.thumbnail || "https://via.placeholder.com/500x300?text=Course+Thumbnail",
        duration: courseData.duration || "Not specified",
        modules: courseData.modules || [],
        enrolledStudents: [],
        category: courseData.category || "Uncategorized",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setCourses(prevCourses => [...prevCourses, newCourse]);
      toast.success(`Course "${newCourse.title}" created successfully`);
    } catch (err) {
      setError("Failed to create course");
      toast.error("Failed to create course");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createLearningPath = (pathData: Partial<LearningPath>) => {
    if (!currentUser || currentUser.role !== "instructor") {
      toast.error("You must be an instructor to create learning paths");
      return;
    }

    setLoading(true);
    
    try {
      const newPath: LearningPath = {
        id: `path${learningPaths.length + 1}`,
        title: pathData.title || "Untitled Learning Path",
        description: pathData.description || "No description provided",
        courses: pathData.courses || [],
        createdBy: currentUser.id,
      };
      
      setLearningPaths(prevPaths => [...prevPaths, newPath]);
      toast.success(`Learning path "${newPath.title}" created successfully`);
    } catch (err) {
      setError("Failed to create learning path");
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
