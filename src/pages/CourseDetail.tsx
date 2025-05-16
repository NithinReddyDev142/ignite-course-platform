
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useApp } from "@/contexts/AppContext";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Calendar, Clock, User, BookOpen, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { currentUser } = useAuth();
  const { getCourseById, enrollInCourse, getProgressForCourse } = useApp();
  const navigate = useNavigate();
  
  const course = getCourseById(courseId || "");
  const progress = courseId ? getProgressForCourse(courseId) : undefined;
  
  const [isEnrolled, setIsEnrolled] = useState(false);
  
  useEffect(() => {
    // Check if user is enrolled
    if (course && currentUser) {
      setIsEnrolled(course.enrolledStudents.includes(currentUser.id));
    }
  }, [course, currentUser]);
  
  const handleEnroll = () => {
    if (!courseId) return;
    
    enrollInCourse(courseId);
    setIsEnrolled(true);
  };
  
  const navigateToFirstLesson = () => {
    if (!course || course.modules.length === 0 || course.modules[0].lessons.length === 0) {
      toast.error("This course has no lessons yet");
      return;
    }
    
    const firstModuleId = course.modules[0].id;
    const firstLessonId = course.modules[0].lessons[0].id;
    
    navigate(`/courses/${courseId}/lessons/${firstLessonId}`);
  };
  
  const navigateToContinue = () => {
    if (!course || !progress || !progress.lastAccessedLesson) {
      navigateToFirstLesson();
      return;
    }
    
    navigate(`/courses/${courseId}/lessons/${progress.lastAccessedLesson}`);
  };
  
  // Count total lessons
  const totalLessons = course?.modules.reduce(
    (total, module) => total + module.lessons.length, 
    0
  ) || 0;
  
  // Find first incomplete lesson (for continue learning)
  const findNextLesson = () => {
    if (!course || !progress) return "Next lesson";
    
    for (const module of course.modules) {
      for (const lesson of module.lessons) {
        if (!progress.completedLessons.includes(lesson.id)) {
          return lesson.title;
        }
      }
    }
    
    return "Review course";
  };
  
  if (!course) {
    return (
      <Layout>
        <div className="container mx-auto py-8 px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Course not found</h1>
          <p className="mb-6">The course you're looking for doesn't exist or has been removed.</p>
          <Link to="/courses">
            <Button>Browse Courses</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        {/* Course Header */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
            
            <div className="flex flex-wrap gap-3 mb-4">
              <Badge>{course.category}</Badge>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="mr-1 h-4 w-4" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <BookOpen className="mr-1 h-4 w-4" />
                <span>{totalLessons} lessons</span>
              </div>
              {course.rating && (
                <div className="flex items-center text-sm text-yellow-500">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <span>{course.rating}</span>
                </div>
              )}
            </div>
            
            <p className="mb-6 text-muted-foreground">{course.description}</p>
            
            <div className="flex items-center mb-6">
              <Avatar className="h-10 w-10">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${course.instructorName}`} />
                <AvatarFallback>{course.instructorName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="text-sm font-medium">Instructor</p>
                <p className="text-sm text-muted-foreground">{course.instructorName}</p>
              </div>
            </div>
            
            {currentUser?.role === "student" && (
              <div className="space-x-4">
                {isEnrolled ? (
                  <>
                    {progress && progress.overallProgress > 0 ? (
                      <Button onClick={navigateToContinue}>
                        Continue Learning
                      </Button>
                    ) : (
                      <Button onClick={navigateToFirstLesson}>
                        Start Learning
                      </Button>
                    )}
                    
                    {progress && (
                      <div className="inline-block align-middle ml-4">
                        <div className="flex items-center">
                          <div className="progress-indicator w-32 mr-2">
                            <div className="progress-bar bg-primary" style={{ width: `${progress.overallProgress}%` }}></div>
                          </div>
                          <span className="text-sm">{progress.overallProgress}% complete</span>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <Button onClick={handleEnroll}>
                    Enroll in Course
                  </Button>
                )}
              </div>
            )}
          </div>
          
          <div>
            <div className="rounded-lg overflow-hidden border shadow-sm">
              <img 
                src={course.thumbnail} 
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              
              <div className="p-4 space-y-4">
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center text-sm">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>
                      Created: {new Date(course.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <User className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>
                      {course.enrolledStudents.length} student{course.enrolledStudents.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  
                  {isEnrolled && progress && (
                    <div className="flex items-center text-sm">
                      <Award className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>
                        {progress.completedLessons.length} of {totalLessons} lessons completed
                      </span>
                    </div>
                  )}
                </div>
                
                {isEnrolled && progress && progress.overallProgress > 0 && (
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm font-medium mb-1">Continue where you left off</p>
                      <p className="text-xs text-muted-foreground mb-2">{findNextLesson()}</p>
                      <Button size="sm" className="w-full" onClick={navigateToContinue}>
                        Resume
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Course Content */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-semibold mb-4">Course Content</h2>
            
            <Accordion type="single" collapsible className="w-full">
              {course.modules.map((module, index) => (
                <AccordionItem key={module.id} value={module.id}>
                  <AccordionTrigger>
                    <div className="flex justify-between w-full pr-4">
                      <span className="font-medium">
                        {index + 1}. {module.title}
                      </span>
                      <span className="text-muted-foreground text-sm">
                        {module.lessons.length} lessons
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-1">
                      {module.lessons.map((lesson, lessonIndex) => (
                        <li key={lesson.id} className="border-b last:border-0 py-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              {isEnrolled && progress && progress.completedLessons.includes(lesson.id) ? (
                                <span className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                  </svg>
                                </span>
                              ) : (
                                <span className="h-5 w-5 rounded-full bg-muted text-muted-foreground text-xs flex items-center justify-center">
                                  {index + 1}.{lessonIndex + 1}
                                </span>
                              )}
                              
                              {isEnrolled ? (
                                <Link 
                                  to={`/courses/${course.id}/lessons/${lesson.id}`}
                                  className="hover:text-primary transition-colors"
                                >
                                  {lesson.title}
                                </Link>
                              ) : (
                                <span className="text-muted-foreground">{lesson.title}</span>
                              )}
                            </div>
                            
                            <span className="text-xs text-muted-foreground">
                              {lesson.duration}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            
            {course.modules.length === 0 && (
              <p className="text-muted-foreground py-4">
                This course does not have any content yet.
              </p>
            )}
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4">Course Details</h2>
            
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">What you'll learn</h3>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                      <li>Key concepts and principles of {course.category}</li>
                      <li>Practical skills through hands-on exercises</li>
                      <li>Real-world application of course material</li>
                      <li>Problem-solving techniques in {course.category}</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Prerequisites</h3>
                    <p className="text-muted-foreground">
                      Basic understanding of the subject matter is recommended but not required.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Target Audience</h3>
                    <p className="text-muted-foreground">
                      This course is designed for both beginners and intermediates looking to enhance their skills in {course.category}.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CourseDetail;
