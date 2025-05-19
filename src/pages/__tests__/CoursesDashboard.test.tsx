
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import CoursesDashboard from "../CoursesDashboard";
import { AppProvider } from "@/contexts/AppContext";
import { AuthProvider } from "@/contexts/AuthContext";
import '@testing-library/jest-dom';

// Mock the hooks
vi.mock("@/contexts/AuthContext", async () => {
  const actual = await vi.importActual("@/contexts/AuthContext");
  return {
    ...actual,
    useAuth: () => ({
      currentUser: { 
        id: "user1", 
        name: "Test User", 
        email: "test@example.com", 
        role: "student" 
      },
      isLoading: false,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
    }),
  };
});

vi.mock("@/contexts/AppContext", async () => {
  const actual = await vi.importActual("@/contexts/AppContext");
  
  // Sample data for testing
  const mockCourses = [
    {
      id: "course1",
      title: "React Basics",
      description: "Learn the fundamentals of React",
      instructorId: "instructor1",
      instructorName: "John Doe",
      thumbnail: "https://example.com/thumbnail1.jpg",
      duration: "8 hours",
      modules: [],
      enrolledStudents: ["user1", "user2"],
      category: "Web Development",
      createdAt: "2023-01-01T00:00:00.000Z",
      updatedAt: "2023-01-01T00:00:00.000Z",
    },
    {
      id: "course2",
      title: "Advanced JavaScript",
      description: "Master JavaScript concepts",
      instructorId: "instructor2",
      instructorName: "Jane Smith",
      thumbnail: "https://example.com/thumbnail2.jpg",
      duration: "10 hours",
      modules: [],
      enrolledStudents: ["user3"],
      category: "Programming",
      createdAt: "2023-01-02T00:00:00.000Z",
      updatedAt: "2023-01-02T00:00:00.000Z",
    }
  ];

  return {
    ...actual,
    useApp: () => ({
      courses: mockCourses,
      myCourses: mockCourses.filter(course => course.enrolledStudents.includes("user1")),
      studentProgress: [
        {
          userId: "user1",
          courseId: "course1",
          completedLessons: ["lesson1", "lesson2"],
          overallProgress: 50,
          quizScores: []
        }
      ],
      enrollInCourse: vi.fn(),
      getCourseById: vi.fn(),
      getProgressForCourse: () => ({
        overallProgress: 50,
        completedLessons: ["lesson1", "lesson2"]
      }),
    }),
  };
});

// Mock Layout component to simplify testing
vi.mock("@/components/Layout", () => ({
  default: ({ children }) => <div data-testid="layout">{children}</div>,
}));

// Wrapper component for providers
const AllTheProviders = ({ children }) => {
  return (
    <MemoryRouter>
      <AuthProvider>
        <AppProvider>
          {children}
        </AppProvider>
      </AuthProvider>
    </MemoryRouter>
  );
};

describe("CoursesDashboard", () => {
  it("renders the course dashboard with title", () => {
    render(<CoursesDashboard />, { wrapper: AllTheProviders });
    expect(screen.getByText("Courses Dashboard")).toBeInTheDocument();
  });

  it("displays course statistics", () => {
    render(<CoursesDashboard />, { wrapper: AllTheProviders });
    expect(screen.getByText("Total Courses")).toBeInTheDocument();
    expect(screen.getByText("Categories")).toBeInTheDocument();
  });

  it("shows courses in grid view by default", () => {
    render(<CoursesDashboard />, { wrapper: AllTheProviders });
    expect(screen.getByText("React Basics")).toBeInTheDocument();
    // Check for course card element
    const cards = document.querySelectorAll(".course-card");
    expect(cards.length).toBeGreaterThan(0);
  });

  it("switches between grid and list views", async () => {
    render(<CoursesDashboard />, { wrapper: AllTheProviders });
    const user = userEvent.setup();
    
    // Initially in grid view
    expect(document.querySelectorAll(".course-card").length).toBeGreaterThan(0);
    
    // Switch to list view
    await user.click(screen.getByText("List"));
    
    // Should now show table
    await waitFor(() => {
      expect(screen.getByRole("table")).toBeInTheDocument();
    });
    
    // Switch back to grid
    await user.click(screen.getByText("Grid"));
    
    // Should show cards again
    await waitFor(() => {
      expect(document.querySelectorAll(".course-card").length).toBeGreaterThan(0);
    });
  });

  it("filters courses when searching", async () => {
    render(<CoursesDashboard />, { wrapper: AllTheProviders });
    const user = userEvent.setup();
    
    // Initially shows all courses
    expect(screen.getByText("React Basics")).toBeInTheDocument();
    expect(screen.getByText("Advanced JavaScript")).toBeInTheDocument();
    
    // Search for React
    const searchInput = screen.getByPlaceholderText("Search courses...");
    await user.type(searchInput, "React");
    
    // Should only show React course
    await waitFor(() => {
      expect(screen.getByText("React Basics")).toBeInTheDocument();
      expect(screen.queryByText("Advanced JavaScript")).not.toBeInTheDocument();
    });
  });

  it("filters courses by category", async () => {
    render(<CoursesDashboard />, { wrapper: AllTheProviders });
    const user = userEvent.setup();
    
    // Open category dropdown
    const categorySelect = screen.getByText("Filter by category");
    await user.click(categorySelect);
    
    // Select Web Development category
    await user.click(screen.getByText("Web Development"));
    
    // Should only show Web Development courses
    await waitFor(() => {
      expect(screen.getByText("React Basics")).toBeInTheDocument();
      expect(screen.queryByText("Advanced JavaScript")).not.toBeInTheDocument();
    });
  });

  it("shows enrolled courses when switching to enrolled tab", async () => {
    render(<CoursesDashboard />, { wrapper: AllTheProviders });
    const user = userEvent.setup();
    
    // Click on Enrolled tab
    await user.click(screen.getByText("Enrolled"));
    
    // Should show enrolled courses
    await waitFor(() => {
      expect(screen.getByText("React Basics")).toBeInTheDocument();
      // Advanced JavaScript isn't in the enrolled courses
      expect(screen.queryByText("Advanced JavaScript")).not.toBeInTheDocument();
    });
  });
});
