
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CoursesDashboard from "./pages/CoursesDashboard";
import CourseDetail from "./pages/CourseDetail";
import LessonView from "./pages/LessonView";
import CourseCreate from "./pages/CourseCreate";
import LearningPaths from "./pages/LearningPaths";
import PathDetail from "./pages/PathDetail";
import NotFound from "./pages/NotFound";

// Context Providers
import { AuthProvider } from "./contexts/AuthContext";
import { AppProvider } from "./contexts/AppContext";

// Components
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AppProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/courses" element={
                <ProtectedRoute>
                  <CoursesDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/courses/:courseId" element={
                <ProtectedRoute>
                  <CourseDetail />
                </ProtectedRoute>
              } />
              
              <Route path="/courses/:courseId/lessons/:lessonId" element={
                <ProtectedRoute>
                  <LessonView />
                </ProtectedRoute>
              } />
              
              <Route path="/create-course" element={
                <ProtectedRoute instructorOnly={true}>
                  <CourseCreate />
                </ProtectedRoute>
              } />
              
              <Route path="/learning-paths" element={
                <ProtectedRoute>
                  <LearningPaths />
                </ProtectedRoute>
              } />
              
              <Route path="/learning-paths/:pathId" element={
                <ProtectedRoute>
                  <PathDetail />
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AppProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
