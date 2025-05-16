
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useApp } from "@/contexts/AppContext";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const LessonView = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const { currentUser } = useAuth();
  const { getCourseById, getProgressForCourse, updateProgress } = useApp();
  const navigate = useNavigate();
  
  const course = courseId ? getCourseById(courseId) : undefined;
  const progress = courseId ? getProgressForCourse(courseId) : undefined;
  
  const [currentLessonIndex, setCurrentLessonIndex] = useState({ moduleIndex: 0, lessonIndex: 0 });
  const [showSidebar, setShowSidebar] = useState(true);
  const [lessonCompleted, setLessonCompleted] = useState(false);
  
  // Find current lesson
  const currentModule = course?.modules[currentLessonIndex.moduleIndex];
  const currentLesson = currentModule?.lessons[currentLessonIndex.lessonIndex];
  
  // Find all lessons (flattened)
  const allLessons = course?.modules.flatMap(module => 
    module.lessons.map(lesson => ({
      moduleIndex: course.modules.findIndex(m => m.id === module.id),
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      moduleTitle: module.title
    }))
  ) || [];
  
  // Find current lesson's position in the flattened list
  const currentFlatIndex = allLessons.findIndex(lesson => lesson.lessonId === lessonId);
  
  useEffect(() => {
    if (!course || !lessonId) return;
    
    // Find module and lesson index based on lessonId
    for (let moduleIndex = 0; moduleIndex < course.modules.length; moduleIndex++) {
      const module = course.modules[moduleIndex];
      const lessonIndex = module.lessons.findIndex(lesson => lesson.id === lessonId);
      
      if (lessonIndex !== -1) {
        setCurrentLessonIndex({ moduleIndex, lessonIndex });
        break;
      }
    }
    
    // Check if lesson is already completed
    if (progress && progress.completedLessons.includes(lessonId)) {
      setLessonCompleted(true);
    } else {
      setLessonCompleted(false);
    }
  }, [course, lessonId, progress]);
  
  const handlePreviousLesson = () => {
    if (currentFlatIndex <= 0 || !course) return;
    
    const prevLesson = allLessons[currentFlatIndex - 1];
    navigate(`/courses/${courseId}/lessons/${prevLesson.lessonId}`);
  };
  
  const handleNextLesson = () => {
    if (currentFlatIndex >= allLessons.length - 1 || !course) {
      // Last lesson in course
      toast.success("You've completed the entire course!");
      navigate(`/courses/${courseId}`);
      return;
    }
    
    const nextLesson = allLessons[currentFlatIndex + 1];
    navigate(`/courses/${courseId}/lessons/${nextLesson.lessonId}`);
  };
  
  const handleMarkAsComplete = () => {
    if (!courseId || !lessonId) return;
    
    updateProgress(courseId, lessonId);
    setLessonCompleted(true);
    toast.success("Lesson marked as completed!");
  };
  
  const handleLessonClick = (clickedLessonId: string) => {
    navigate(`/courses/${courseId}/lessons/${clickedLessonId}`);
  };
  
  if (!course || !currentLesson) {
    return (
      <Layout>
        <div className="container mx-auto py-8 px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Lesson not found</h1>
          <p className="mb-6">The lesson you're looking for doesn't exist or has been removed.</p>
          {courseId && (
            <Button onClick={() => navigate(`/courses/${courseId}`)}>
              Back to Course
            </Button>
          )}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Lesson Sidebar */}
          <div className={`md:w-1/4 ${showSidebar ? 'block' : 'hidden md:block'}`}>
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-secondary p-4">
                <h3 className="font-semibold">Course Content</h3>
                <p className="text-sm text-muted-foreground">{course.title}</p>
                <div className="mt-2 text-xs">
                  <span>
                    {progress ? `${progress.overallProgress}% complete` : "0% complete"}
                  </span>
                  <div className="progress-indicator mt-1">
                    <div 
                      className="progress-bar bg-primary" 
                      style={{ width: progress ? `${progress.overallProgress}%` : "0%" }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="p-2 max-h-[60vh] overflow-y-auto">
                {course.modules.map((module, moduleIndex) => (
                  <Collapsible 
                    key={module.id} 
                    defaultOpen={moduleIndex === currentLessonIndex.moduleIndex}
                    className="mb-1"
                  >
                    <CollapsibleTrigger className="flex justify-between items-center w-full p-2 hover:bg-muted rounded text-sm font-medium">
                      <span>{module.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {module.lessons.length} lessons
                      </span>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <ul className="pl-2 space-y-1">
                        {module.lessons.map((lesson) => (
                          <li 
                            key={lesson.id}
                            className={`
                              flex items-center p-2 rounded cursor-pointer text-xs
                              ${lesson.id === lessonId ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted'}
                            `}
                            onClick={() => handleLessonClick(lesson.id)}
                          >
                            {progress && progress.completedLessons.includes(lesson.id) ? (
                              <Check className="mr-2 h-3 w-3 text-primary" />
                            ) : (
                              <div className="w-3 h-3 mr-2" />
                            )}
                            <span className="truncate">{lesson.title}</span>
                          </li>
                        ))}
                      </ul>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </div>
          </div>
          
          {/* Lesson Content */}
          <div className="md:w-3/4">
            <div className="md:hidden mb-4">
              <Button 
                variant="outline" 
                onClick={() => setShowSidebar(!showSidebar)}
                className="w-full"
              >
                {showSidebar ? "Hide" : "Show"} Course Content
              </Button>
            </div>
            
            <div className="text-sm text-muted-foreground mb-2">
              {currentModule?.title} &gt; Lesson {currentLessonIndex.lessonIndex + 1}
            </div>
            
            <h1 className="text-2xl font-bold mb-6">{currentLesson.title}</h1>
            
            {/* Video player placeholder */}
            {currentLesson.videoUrl && (
              <div className="bg-muted w-full aspect-video rounded-lg mb-6 flex items-center justify-center">
                <p className="text-muted-foreground">
                  Video player would be embedded here
                </p>
              </div>
            )}
            
            {/* Lesson content */}
            <div className="prose prose-slate dark:prose-invert max-w-none mb-8">
              <p className="whitespace-pre-line">{currentLesson.content}</p>
            </div>
            
            <Separator className="my-6" />
            
            {/* Navigation and completion buttons */}
            <div className="flex justify-between items-center">
              <Button 
                variant="outline" 
                onClick={handlePreviousLesson}
                disabled={currentFlatIndex <= 0}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous Lesson
              </Button>
              
              <div className="flex space-x-2">
                {!lessonCompleted && (
                  <Button onClick={handleMarkAsComplete}>
                    <Check className="mr-2 h-4 w-4" />
                    Mark as Complete
                  </Button>
                )}
                
                <Button 
                  onClick={handleNextLesson}
                  disabled={currentFlatIndex >= allLessons.length - 1}
                >
                  {lessonCompleted ? (
                    <>
                      Next Lesson
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Skip
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LessonView;
