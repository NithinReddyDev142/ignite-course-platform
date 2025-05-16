
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Course } from "@/lib/types";
import { useApp } from "@/contexts/AppContext";

interface CourseCardProps {
  course: Course;
  showEnroll?: boolean;
}

const CourseCard = ({ course, showEnroll = false }: CourseCardProps) => {
  const { enrollInCourse, getProgressForCourse } = useApp();
  const progress = getProgressForCourse(course.id);
  
  const handleEnroll = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    enrollInCourse(course.id);
  };

  return (
    <Card className="overflow-hidden course-card">
      <Link to={`/courses/${course.id}`}>
        <div className="relative h-48 overflow-hidden">
          <img 
            src={course.thumbnail} 
            alt={course.title} 
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
          <Badge variant="secondary" className="absolute top-2 right-2">
            {course.category}
          </Badge>
        </div>
        
        <CardHeader className="pb-2">
          <h3 className="font-bold text-lg truncate">{course.title}</h3>
          <p className="text-sm text-muted-foreground">By {course.instructorName}</p>
        </CardHeader>
        
        <CardContent className="pb-2">
          <p className="line-clamp-2 text-sm text-muted-foreground h-10">
            {course.description}
          </p>
        </CardContent>
        
        <CardFooter className="flex justify-between items-center pt-0">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{course.duration}</span>
            {course.rating && (
              <div className="flex items-center">
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <span className="text-sm ml-1">{course.rating}</span>
              </div>
            )}
          </div>
          
          {progress && (
            <div className="flex items-center gap-2">
              <div className="progress-indicator w-16">
                <div className="progress-bar bg-primary" style={{ width: `${progress.overallProgress}%` }}></div>
              </div>
              <span className="text-xs">{progress.overallProgress}%</span>
            </div>
          )}
          
          {!progress && showEnroll && (
            <button 
              onClick={handleEnroll}
              className="text-xs bg-primary text-white px-2 py-1 rounded hover:bg-primary/90 transition-colors"
            >
              Enroll Now
            </button>
          )}
        </CardFooter>
      </Link>
    </Card>
  );
};

export default CourseCard;
