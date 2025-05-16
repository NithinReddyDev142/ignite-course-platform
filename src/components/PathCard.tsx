
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { LearningPath } from "@/lib/types";
import { useApp } from "@/contexts/AppContext";

interface PathCardProps {
  path: LearningPath;
}

const PathCard = ({ path }: PathCardProps) => {
  const { courses } = useApp();
  
  // Get courses that belong to this path
  const pathCourses = courses.filter(course => path.courses.includes(course.id));

  return (
    <Card className="overflow-hidden course-card h-full flex flex-col">
      <Link to={`/learning-paths/${path.id}`} className="flex flex-col h-full">
        <CardHeader className="pb-2">
          <h3 className="font-bold text-lg">{path.title}</h3>
        </CardHeader>
        
        <CardContent className="pb-2 flex-grow">
          <p className="text-sm text-muted-foreground mb-4">
            {path.description}
          </p>
          
          <div className="space-y-1">
            <p className="text-sm font-medium">Included Courses:</p>
            <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
              {pathCourses.map(course => (
                <li key={course.id} className="truncate">{course.title}</li>
              ))}
            </ul>
          </div>
        </CardContent>
        
        <CardFooter className="pt-0 mt-auto">
          <div className="flex justify-between w-full items-center">
            <span className="text-sm text-muted-foreground">
              {pathCourses.length} {pathCourses.length === 1 ? 'course' : 'courses'}
            </span>
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
              View Path
            </span>
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default PathCard;
