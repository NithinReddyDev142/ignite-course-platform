import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useApp } from "@/contexts/AppContext";
import Layout from "@/components/Layout";
import CourseCard from "@/components/CourseCard";
import { Book, GraduationCap, Users } from "lucide-react";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { courses, myCourses, studentProgress } = useApp();
  const [recentCourses, setRecentCourses] = useState(myCourses);

  useEffect(() => {
    // For demo purposes, sort by a combination of enrollment status and progress
    const sorted = [...myCourses].sort((a, b) => {
      const progressA = studentProgress.find(p => p.courseId === a.id && p.userId === currentUser?.id);
      const progressB = studentProgress.find(p => p.courseId === b.id && b.userId === currentUser?.id);
      
      // If there's progress, sort by last accessed (for demo, we'll just use progress percentage)
      if (progressA && progressB) {
        return progressB.overallProgress - progressA.overallProgress;
      }
      
      // If only one has progress, prioritize it
      if (progressA) return -1;
      if (progressB) return 1;
      
      // Otherwise sort by most recently added (using course ID as proxy in this demo)
      return b.id.localeCompare(a.id);
    });
    
    setRecentCourses(sorted);
  }, [myCourses, studentProgress, currentUser]);

  // Filter new courses (not enrolled)
  const newCourses = courses.filter(
    course => !myCourses.some(mc => mc.id === course.id)
  ).slice(0, 3);

  // Calculate overall progress across all courses
  const calculateOverallProgress = () => {
    if (!currentUser || currentUser.role !== "student" || studentProgress.length === 0) {
      return 0;
    }
    
    const userProgress = studentProgress.filter(p => p.userId === currentUser.id);
    if (userProgress.length === 0) return 0;
    
    const totalProgress = userProgress.reduce((sum, p) => sum + p.overallProgress, 0);
    return Math.round(totalProgress / userProgress.length);
  };

  const overallProgress = calculateOverallProgress();

  // Stats data
  const studentStats = [
    {
      title: "Enrolled Courses",
      value: myCourses.length,
      icon: <Book className="h-4 w-4 text-blue-500" />,
      description: "Courses you are currently taking",
    },
    {
      title: "Overall Progress",
      value: `${overallProgress}%`,
      icon: <GraduationCap className="h-4 w-4 text-green-500" />,
      description: "Average completion across all courses",
    },
  ];

  const instructorStats = [
    {
      title: "Your Courses",
      value: myCourses.length,
      icon: <Book className="h-4 w-4 text-blue-500" />,
      description: "Courses you're teaching",
    },
    {
      title: "Total Students",
      value: myCourses.reduce((sum, course) => sum + course.enrolledStudents.length, 0),
      icon: <Users className="h-4 w-4 text-indigo-500" />,
      description: "Students enrolled in your courses",
    },
  ];

  const stats = currentUser?.role === "instructor" ? instructorStats : studentStats;

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {currentUser?.name}! {currentUser?.role === "student" ? "Continue your learning journey." : "Manage your courses and students."}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
          
          <Card className="bg-primary/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {currentUser?.role === "instructor" ? (
                <>
                  <Link to="/create-course" className="block text-primary hover:underline text-sm">
                    + Create a new course
                  </Link>
                  <Link to="/courses" className="block text-primary hover:underline text-sm">
                    View all your courses
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/courses" className="block text-primary hover:underline text-sm">
                    + Enroll in new courses
                  </Link>
                  <Link to="/learning-paths" className="block text-primary hover:underline text-sm">
                    Explore learning paths
                  </Link>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different sections */}
        <Tabs defaultValue="my-courses" className="space-y-6">
          <TabsList>
            <TabsTrigger value="my-courses">
              {currentUser?.role === "instructor" ? "Your Courses" : "My Courses"}
            </TabsTrigger>
            <TabsTrigger value="recommended">
              {currentUser?.role === "instructor" ? "Course Analytics" : "Recommended"}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="my-courses" className="space-y-6">
            {recentCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentCourses.slice(0, 6).map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">No Courses Yet</CardTitle>
                  <CardDescription>
                    {currentUser?.role === "instructor" 
                      ? "Create your first course to get started."
                      : "Enroll in courses to begin your learning journey."
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link 
                    to={currentUser?.role === "instructor" ? "/create-course" : "/courses"}
                    className="inline-block bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors"
                  >
                    {currentUser?.role === "instructor" ? "Create Course" : "Browse Courses"}
                  </Link>
                </CardContent>
              </Card>
            )}
            
            {recentCourses.length > 0 && (
              <div className="flex justify-center">
                <Link
                  to="/courses"
                  className="text-primary hover:underline"
                >
                  View All Courses
                </Link>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="recommended" className="space-y-6">
            {currentUser?.role === "instructor" ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Course Performance</CardTitle>
                  <CardDescription>
                    Overview of student engagement with your courses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {myCourses.length > 0 ? (
                    <div className="space-y-4">
                      {myCourses.slice(0, 3).map(course => (
                        <div key={course.id} className="flex justify-between items-center border-b pb-3">
                          <div>
                            <h4 className="font-medium">{course.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {course.enrolledStudents.length} students enrolled
                            </p>
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">{course.rating ? course.rating : "N/A"}</span>
                            <span className="text-muted-foreground"> / 5 rating</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      Create courses to see analytics data.
                    </p>
                  )}
                </CardContent>
              </Card>
            ) : (
              <>
                <h3 className="text-xl font-semibold">Recommended for You</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {newCourses.map((course) => (
                    <CourseCard key={course.id} course={course} showEnroll={true} />
                  ))}
                </div>
                
                {newCourses.length > 0 && (
                  <div className="flex justify-center">
                    <Link
                      to="/courses"
                      className="text-primary hover:underline"
                    >
                      Explore More Courses
                    </Link>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Dashboard;
