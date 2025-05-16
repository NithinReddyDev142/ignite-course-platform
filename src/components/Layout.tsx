
import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Book, Home, LogOut, User, Folder, GraduationCap } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { label: "Home", path: "/dashboard", icon: <Home className="mr-2 h-4 w-4" /> },
    { label: "Courses", path: "/courses", icon: <Book className="mr-2 h-4 w-4" /> },
    { label: "Learning Paths", path: "/learning-paths", icon: <GraduationCap className="mr-2 h-4 w-4" /> },
  ];

  // Add instructor-only routes
  const instructorNavItems = currentUser?.role === "instructor" ? [
    { label: "Create Course", path: "/create-course", icon: <Folder className="mr-2 h-4 w-4" /> },
  ] : [];
  
  // Combine both arrays
  const allNavItems = [...navItems, ...instructorNavItems];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b sticky top-0 z-10 bg-white dark:bg-slate-900">
        <div className="container mx-auto flex justify-between items-center p-4">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="text-2xl font-bold text-primary">
              EduLearn LMS
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {allNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center transition-colors hover:text-primary ${
                  location.pathname === item.path ? "text-primary font-medium" : "text-muted-foreground"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User Profile Menu */}
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
                    <AvatarFallback>
                      {currentUser?.name.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t">
          <div className="container mx-auto flex justify-between px-2">
            {allNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-1 flex-col items-center py-2 transition-colors hover:text-primary ${
                  location.pathname === item.path ? "text-primary font-medium" : "text-muted-foreground"
                }`}
              >
                {item.icon}
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-white dark:bg-slate-900">
        <div className="container mx-auto py-4 px-4">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} EduLearn LMS. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
