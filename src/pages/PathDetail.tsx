
import { useParams, Link } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, ArrowRight } from "lucide-react";

const PathDetail = () => {
  const { pathId } = useParams<{ pathId: string }>();
  const { getLearningPathById, getCourseById, getProgressForCourse } = useApp();
  
  const path = pathId ? getLearningPathById(pathId) : undefined;
  
  // Get the courses in this path
  const pathCourses = path
    ? path.courses.map(courseId => getCourseById(courseId)).filter(Boolean)
    : [];
  
  // Calculate overall progress for the path
  const calculatePathProgress = () => {
    if (pathCourses.length === 0) return 0;
    
    let totalProgress = 0;
    let coursesWithProgress = 0;
    
    pathCourses.forEach(course => {
      if (!course) return;
      
      const courseProgress = getProgressForCourse(course.id);
      if (courseProgress) {
        totalProgress += courseProgress.overallProgress;
        coursesWithProgress++;
      }
    });
    
    return coursesWithProgress > 0 ? Math.round(totalProgress / coursesWithProgress) : 0;
  };
  
  const pathProgress = calculatePathProgress();
  
  if (!path) {
    return (
      <Layout>
        <div className="container mx-auto py-8 px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Learning Path not found</h1>
          <p className="mb-6">The learning path you're looking for doesn't exist or has been removed.</p>
          <Link to="/learning-paths">
            <Button>Browse Learning Paths</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-2/3">
            <h1 className="text-3xl font-bold mb-4">{path.title}</h1>
            <p className="text-lg text-muted-foreground mb-6">{path.description}</p>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Path Progress</h2>
              <div className="flex items-center gap-4">
                <Progress value={pathProgress} className="h-2 flex-grow" />
                <span className="text-sm font-medium">{pathProgress}%</span>
              </div>
            </div>
            
            <h2 className="text-xl font-semibold mb-4">Courses in this Path</h2>
            <div className="space-y-4">
              {pathCourses.map((course, index) => {
                if (!course) return null;
                
                const progress = getProgressForCourse(course.id);
                const isCompleted = progress && progress.overallProgress === 100;
                const isStarted = progress && progress.overallProgress > 0;
                
                return (
                  <Card key={course.id} className="overflow-hidden">
                    <div className="md:flex">
                      <div className="md:w-1/4">
                        <img 
                          src={course.thumbnail} 
                          alt={course.title}
                          className="w-full h-full object-cover md:max-h-40"
                        />
                      </div>
                      
                      <div className="p-4 md:p-6 md:w-3/4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center justify-center h-7 w-7 rounded-full bg-primary/10 text-primary font-medium text-sm">
                              {index + 1}
                            </span>
                            <h3 className="font-semibold text-lg">{course.title}</h3>
                          </div>
                          
                          <Badge variant={isCompleted ? "default" : "outline"}>
                            {isCompleted ? (
                              <span className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                Completed
                              </span>
                            ) : isStarted ? (
                              "In Progress"
                            ) : (
                              "Not Started"
                            )}
                          </Badge>
                        </div>
                        
                        <p className="text-muted-foreground mt-2 mb-4 line-clamp-2">
                          {course.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{course.modules.length} modules</span>
                            <span>•</span>
                            <span>{course.duration}</span>
                          </div>
                          
                          <Link to={`/courses/${course.id}`}>
                            <Button variant="outline" size="sm">
                              {isStarted ? "Continue" : "Start"} Course
                              <ArrowRight className="ml-2 h-3 w-3" />
                            </Button>
                          </Link>
                        </div>
                        
                        {progress && (
                          <div className="mt-3">
                            <div className="flex items-center gap-3">
                              <Progress value={progress.overallProgress} className="h-1 flex-grow" />
                              <span className="text-xs text-muted-foreground">{progress.overallProgress}%</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
              
              {pathCourses.length === 0 && (
                <div className="text-center py-8 border rounded-lg">
                  <p className="text-muted-foreground">No courses in this learning path.</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="md:w-1/3">
            <Card>
              <CardHeader>
                <CardTitle>Path Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-medium">Path Progress</div>
                  <div className="mt-1 flex items-center gap-3">
                    <Progress value={pathProgress} className="h-2 flex-grow" />
                    <span className="text-sm font-medium">{pathProgress}%</span>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="text-sm font-medium mb-2">What you'll learn</div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                      <span>Comprehensive understanding of {path.title.toLowerCase()}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                      <span>Practical skills through hands-on exercises</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                      <span>Industry-relevant knowledge and best practices</span>
                    </li>
                  </ul>
                </div>
                
                <div className="border-t pt-4">
                  <div className="text-sm font-medium mb-2">Path details</div>
                  <div className="text-sm text-muted-foreground">
                    <div className="flex justify-between py-1">
                      <span>Courses:</span>
                      <span className="font-medium text-foreground">{pathCourses.length}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Total duration:</span>
                      <span className="font-medium text-foreground">
                        {pathCourses.length ? `Approx. ${pathCourses.length * 2} weeks` : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Difficulty:</span>
                      <span className="font-medium text-foreground">All levels</span>
                    </div>
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

export default PathDetail;
