
import { useState } from "react";
import Layout from "@/components/Layout";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CourseCard from "@/components/CourseCard";
import { Search, Filter, Users, Book } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Course } from "@/lib/types";

const CoursesDashboard = () => {
  const { courses, myCourses, studentProgress } = useApp();
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Get unique categories from courses
  const categories = [...new Set(courses.map((course) => course.category))];

  // Filter courses based on search, category, and view type
  const filteredCourses = (currentUser?.role === "instructor" ? myCourses : courses).filter(
    (course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || course.category === categoryFilter;
      return matchesSearch && matchesCategory;
    }
  );

  // Calculate course statistics
  const totalCourses = filteredCourses.length;
  const totalStudents = filteredCourses.reduce(
    (sum, course) => sum + course.enrolledStudents.length,
    0
  );
  const categoryCounts = filteredCourses.reduce((acc, course) => {
    acc[course.category] = (acc[course.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary">Courses Dashboard</h1>
            <p className="text-muted-foreground">
              {currentUser?.role === "instructor"
                ? "Manage and track your courses"
                : "Explore and manage your enrolled courses"}
            </p>
          </div>

          {currentUser?.role === "instructor" && (
            <Link to="/create-course">
              <Button className="mt-4 md:mt-0">Create New Course</Button>
            </Link>
          )}
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
              <Book className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCourses}</div>
              <p className="text-xs text-muted-foreground">
                {currentUser?.role === "instructor" 
                  ? "Courses you've created" 
                  : "Available courses"}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {currentUser?.role === "instructor" ? "Total Students" : "Enrolled Courses"}
              </CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {currentUser?.role === "instructor" 
                  ? totalStudents 
                  : myCourses.length}
              </div>
              <p className="text-xs text-muted-foreground">
                {currentUser?.role === "instructor"
                  ? "Students enrolled in your courses"
                  : "Courses you're currently taking"}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <Filter className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Object.keys(categoryCounts).length}</div>
              <p className="text-xs text-muted-foreground">
                {Object.entries(categoryCounts)
                  .slice(0, 2)
                  .map(([category, count]) => `${category} (${count})`)
                  .join(", ")}
                {Object.keys(categoryCounts).length > 2 && " and more..."}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search courses..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value)}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex border rounded-md overflow-hidden">
            <button
              className={`px-3 py-2 ${viewMode === "grid" ? "bg-primary text-white" : "bg-white"}`}
              onClick={() => setViewMode("grid")}
            >
              Grid
            </button>
            <button
              className={`px-3 py-2 ${viewMode === "list" ? "bg-primary text-white" : "bg-white"}`}
              onClick={() => setViewMode("list")}
            >
              List
            </button>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Courses</TabsTrigger>
            {currentUser?.role === "student" && (
              <TabsTrigger value="enrolled">Enrolled</TabsTrigger>
            )}
            {currentUser?.role === "instructor" && (
              <TabsTrigger value="popular">Most Popular</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {filteredCourses.length > 0 ? (
              viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      showEnroll={currentUser?.role === "student"}
                    />
                  ))}
                </div>
              ) : (
                <Table>
                  <TableCaption>
                    A list of {filteredCourses.length} courses.
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Instructor</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Created</TableHead>
                      {currentUser?.role === "student" && <TableHead>Action</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCourses.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell className="font-medium">
                          <Link to={`/courses/${course.id}`} className="hover:text-primary">
                            {course.title}
                          </Link>
                        </TableCell>
                        <TableCell>{course.category}</TableCell>
                        <TableCell>{course.instructorName}</TableCell>
                        <TableCell>{course.enrolledStudents.length}</TableCell>
                        <TableCell>{formatDate(course.createdAt)}</TableCell>
                        {currentUser?.role === "student" && (
                          <TableCell>
                            <Link to={`/courses/${course.id}`}>
                              <Button variant="outline" size="sm">
                                View
                              </Button>
                            </Link>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No Courses Found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery || categoryFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "There are no courses available at the moment"}
                </p>

                {currentUser?.role === "instructor" && (
                  <Link to="/create-course">
                    <Button>Create Your First Course</Button>
                  </Link>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="enrolled" className="space-y-6">
            {currentUser?.role === "student" && (
              <>
                {myCourses.length > 0 ? (
                  viewMode === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {myCourses.map((course) => (
                        <CourseCard key={course.id} course={course} />
                      ))}
                    </div>
                  ) : (
                    <Table>
                      <TableCaption>Your enrolled courses.</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Progress</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Instructor</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {myCourses.map((course) => {
                          const progress = studentProgress.find(
                            (p) => p.courseId === course.id && p.userId === currentUser.id
                          );
                          return (
                            <TableRow key={course.id}>
                              <TableCell className="font-medium">
                                <Link to={`/courses/${course.id}`} className="hover:text-primary">
                                  {course.title}
                                </Link>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                      className="bg-primary h-2.5 rounded-full"
                                      style={{ width: `${progress?.overallProgress || 0}%` }}
                                    ></div>
                                  </div>
                                  <span>{progress?.overallProgress || 0}%</span>
                                </div>
                              </TableCell>
                              <TableCell>{course.category}</TableCell>
                              <TableCell>{course.instructorName}</TableCell>
                              <TableCell>
                                <Link to={`/courses/${course.id}`}>
                                  <Button variant="outline" size="sm">
                                    Continue
                                  </Button>
                                </Link>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  )
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-semibold mb-2">Not Enrolled in Any Courses</h3>
                    <p className="text-muted-foreground mb-6">
                      Browse available courses and enroll to start learning
                    </p>
                    <Link to="/courses">
                      <Button>Browse Courses</Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="popular" className="space-y-6">
            {currentUser?.role === "instructor" && (
              <>
                {myCourses.length > 0 ? (
                  <Table>
                    <TableCaption>Course popularity by enrollment.</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Students</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[...myCourses]
                        .sort((a, b) => b.enrolledStudents.length - a.enrolledStudents.length)
                        .map((course) => (
                          <TableRow key={course.id}>
                            <TableCell className="font-medium">
                              <Link to={`/courses/${course.id}`} className="hover:text-primary">
                                {course.title}
                              </Link>
                            </TableCell>
                            <TableCell>{course.enrolledStudents.length}</TableCell>
                            <TableCell>{course.category}</TableCell>
                            <TableCell>{course.rating || "N/A"}</TableCell>
                            <TableCell>{formatDate(course.createdAt)}</TableCell>
                            <TableCell>
                              <Link to={`/courses/${course.id}`}>
                                <Button variant="outline" size="sm">
                                  View
                                </Button>
                              </Link>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-semibold mb-2">No Courses Created</h3>
                    <p className="text-muted-foreground mb-6">
                      Create your first course to see popularity data
                    </p>
                    <Link to="/create-course">
                      <Button>Create Course</Button>
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

export default CoursesDashboard;
