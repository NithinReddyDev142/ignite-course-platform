
import { Course, LearningPath, StudentProgress, User } from "./types";

export const sampleUsers: User[] = [
  {
    id: "user1",
    name: "John Smith",
    email: "john@example.com",
    role: "instructor",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: "user2",
    name: "Emily Johnson",
    email: "emily@example.com",
    role: "instructor",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: "user3",
    name: "Michael Brown",
    email: "michael@example.com",
    role: "student",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    id: "user4",
    name: "Sarah Williams",
    email: "sarah@example.com",
    role: "student",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    id: "user5",
    name: "David Miller",
    email: "david@example.com",
    role: "student",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
  },
];

export const sampleCourses: Course[] = [
  {
    id: "course1",
    title: "Introduction to Web Development",
    description: "Learn the basics of HTML, CSS, and JavaScript to build modern websites.",
    instructorId: "user1",
    instructorName: "John Smith",
    thumbnail: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2ViJTIwZGV2ZWxvcG1lbnR8ZW58MHx8MHx8fDA%3D",
    duration: "6 weeks",
    modules: [
      {
        id: "module1",
        title: "HTML Fundamentals",
        lessons: [
          {
            id: "lesson1",
            title: "Basic HTML Structure",
            content: "Learn about the basic structure of an HTML document and how to create elements.",
            videoUrl: "https://example.com/videos/html-basics",
            duration: "15 minutes",
          },
          {
            id: "lesson2",
            title: "HTML Forms",
            content: "Learn how to create interactive forms to collect user input.",
            videoUrl: "https://example.com/videos/html-forms",
            duration: "20 minutes",
          },
        ],
      },
      {
        id: "module2",
        title: "CSS Styling",
        lessons: [
          {
            id: "lesson3",
            title: "CSS Selectors",
            content: "Learn how to select HTML elements to apply styles.",
            videoUrl: "https://example.com/videos/css-selectors",
            duration: "18 minutes",
          },
          {
            id: "lesson4",
            title: "CSS Layout",
            content: "Learn how to create responsive layouts using CSS.",
            videoUrl: "https://example.com/videos/css-layout",
            duration: "25 minutes",
          },
        ],
      },
    ],
    enrolledStudents: ["user3", "user4"],
    rating: 4.5,
    category: "Web Development",
    createdAt: "2023-01-15T12:00:00Z",
    updatedAt: "2023-03-20T14:30:00Z",
  },
  {
    id: "course2",
    title: "Advanced JavaScript Programming",
    description: "Master JavaScript with advanced concepts like closures, promises, and async/await.",
    instructorId: "user1",
    instructorName: "John Smith",
    thumbnail: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8amF2YXNjcmlwdHxlbnwwfHwwfHx8MA%3D%3D",
    duration: "8 weeks",
    modules: [
      {
        id: "module1",
        title: "Advanced Functions",
        lessons: [
          {
            id: "lesson1",
            title: "Closures and Scopes",
            content: "Understanding JavaScript closures and lexical scoping.",
            videoUrl: "https://example.com/videos/closures",
            duration: "22 minutes",
          },
          {
            id: "lesson2",
            title: "Higher-Order Functions",
            content: "Working with functions that operate on other functions.",
            videoUrl: "https://example.com/videos/higher-order-functions",
            duration: "24 minutes",
          },
        ],
      },
      {
        id: "module2",
        title: "Asynchronous JavaScript",
        lessons: [
          {
            id: "lesson3",
            title: "Promises",
            content: "Working with JavaScript promises for asynchronous operations.",
            videoUrl: "https://example.com/videos/promises",
            duration: "26 minutes",
          },
          {
            id: "lesson4",
            title: "Async/Await",
            content: "Using async/await for cleaner asynchronous code.",
            videoUrl: "https://example.com/videos/async-await",
            duration: "28 minutes",
          },
        ],
      },
    ],
    enrolledStudents: ["user3", "user5"],
    rating: 4.8,
    category: "Programming",
    createdAt: "2023-02-10T09:45:00Z",
    updatedAt: "2023-04-05T11:20:00Z",
  },
  {
    id: "course3",
    title: "Data Science with Python",
    description: "Learn how to analyze and visualize data using Python libraries like Pandas and Matplotlib.",
    instructorId: "user2",
    instructorName: "Emily Johnson",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZGF0YSUyMHNjaWVuY2V8ZW58MHx8MHx8fDA%3D",
    duration: "10 weeks",
    modules: [
      {
        id: "module1",
        title: "Introduction to Python",
        lessons: [
          {
            id: "lesson1",
            title: "Python Basics",
            content: "Learn the fundamentals of Python programming.",
            videoUrl: "https://example.com/videos/python-basics",
            duration: "30 minutes",
          },
          {
            id: "lesson2",
            title: "Data Structures in Python",
            content: "Learn about lists, dictionaries, and other data structures in Python.",
            videoUrl: "https://example.com/videos/python-data-structures",
            duration: "25 minutes",
          },
        ],
      },
      {
        id: "module2",
        title: "Data Analysis with Pandas",
        lessons: [
          {
            id: "lesson3",
            title: "Introduction to Pandas",
            content: "Learn how to use Pandas for data manipulation and analysis.",
            videoUrl: "https://example.com/videos/pandas-intro",
            duration: "28 minutes",
          },
          {
            id: "lesson4",
            title: "Data Visualization with Matplotlib",
            content: "Learn how to create visualizations from your data.",
            videoUrl: "https://example.com/videos/matplotlib-intro",
            duration: "32 minutes",
          },
        ],
      },
    ],
    enrolledStudents: ["user4", "user5"],
    rating: 4.7,
    category: "Data Science",
    createdAt: "2023-03-05T15:20:00Z",
    updatedAt: "2023-05-12T10:15:00Z",
  },
  {
    id: "course4",
    title: "Machine Learning Fundamentals",
    description: "Understand the basics of machine learning algorithms and how to implement them.",
    instructorId: "user2",
    instructorName: "Emily Johnson",
    thumbnail: "https://images.unsplash.com/photo-1527474305487-b87b222841cc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFjaGluZSUyMGxlYXJuaW5nfGVufDB8fDB8fHww",
    duration: "12 weeks",
    modules: [
      {
        id: "module1",
        title: "Introduction to Machine Learning",
        lessons: [
          {
            id: "lesson1",
            title: "What is Machine Learning?",
            content: "An overview of machine learning concepts and applications.",
            videoUrl: "https://example.com/videos/ml-intro",
            duration: "20 minutes",
          },
          {
            id: "lesson2",
            title: "Types of Machine Learning",
            content: "Learn about supervised, unsupervised, and reinforcement learning.",
            videoUrl: "https://example.com/videos/ml-types",
            duration: "25 minutes",
          },
        ],
      },
      {
        id: "module2",
        title: "Supervised Learning Algorithms",
        lessons: [
          {
            id: "lesson3",
            title: "Linear Regression",
            content: "Understanding and implementing linear regression.",
            videoUrl: "https://example.com/videos/linear-regression",
            duration: "30 minutes",
          },
          {
            id: "lesson4",
            title: "Classification Algorithms",
            content: "Learn about different classification algorithms.",
            videoUrl: "https://example.com/videos/classification",
            duration: "35 minutes",
          },
        ],
      },
    ],
    enrolledStudents: ["user3"],
    rating: 4.6,
    category: "Data Science",
    createdAt: "2023-04-20T08:30:00Z",
    updatedAt: "2023-06-15T09:45:00Z",
  },
];

export const sampleStudentProgress: StudentProgress[] = [
  {
    userId: "user3",
    courseId: "course1",
    completedLessons: ["lesson1", "lesson2"],
    lastAccessedLesson: "lesson3",
    quizScores: [
      {
        quizId: "quiz1",
        score: 8,
        totalQuestions: 10,
        completedAt: "2023-02-10T14:30:00Z",
      },
    ],
    overallProgress: 50,
  },
  {
    userId: "user3",
    courseId: "course2",
    completedLessons: ["lesson1"],
    lastAccessedLesson: "lesson2",
    quizScores: [],
    overallProgress: 25,
  },
  {
    userId: "user4",
    courseId: "course1",
    completedLessons: ["lesson1", "lesson2", "lesson3"],
    lastAccessedLesson: "lesson4",
    quizScores: [
      {
        quizId: "quiz1",
        score: 9,
        totalQuestions: 10,
        completedAt: "2023-02-15T16:45:00Z",
      },
    ],
    overallProgress: 75,
  },
  {
    userId: "user4",
    courseId: "course3",
    completedLessons: ["lesson1"],
    lastAccessedLesson: "lesson2",
    quizScores: [],
    overallProgress: 25,
  },
  {
    userId: "user5",
    courseId: "course2",
    completedLessons: ["lesson1", "lesson2", "lesson3"],
    lastAccessedLesson: "lesson4",
    quizScores: [
      {
        quizId: "quiz1",
        score: 7,
        totalQuestions: 10,
        completedAt: "2023-03-05T10:15:00Z",
      },
    ],
    overallProgress: 75,
  },
  {
    userId: "user5",
    courseId: "course3",
    completedLessons: ["lesson1", "lesson2"],
    lastAccessedLesson: "lesson3",
    quizScores: [],
    overallProgress: 50,
  },
];

export const sampleLearningPaths: LearningPath[] = [
  {
    id: "path1",
    title: "Web Development Career Path",
    description: "A comprehensive path to become a full-stack web developer.",
    courses: ["course1", "course2"],
    createdBy: "user1",
  },
  {
    id: "path2",
    title: "Data Science Career Path",
    description: "Master data analysis, visualization, and machine learning.",
    courses: ["course3", "course4"],
    createdBy: "user2",
  },
];

export const getCurrentUser = (): User => {
  // In a real app, this would come from authentication
  // For demo purposes, we'll default to a specific user
  return sampleUsers[0];
};
