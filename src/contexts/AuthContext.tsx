
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { User } from "@/lib/types";
import { toast } from "sonner";
import { dummyAuthService } from "@/lib/dummyAuth";

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string, role: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("lms_current_user");
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing stored user:", e);
      }
    }
    setIsLoading(false);
  }, []);

  const register = async (name: string, email: string, password: string, role: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🔐 Attempting to register with dummy auth:', { name, email, role });
      const userData = await dummyAuthService.register(name, email, password, role as 'instructor' | 'student');
      setCurrentUser(userData);
      localStorage.setItem("lms_current_user", JSON.stringify(userData));
      toast.success(`Welcome, ${userData.name}!`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Registration failed";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🔐 Attempting to login with dummy auth:', { email });
      const userData = await dummyAuthService.login(email, password);
      console.log('✅ Login successful, user data:', userData);
      
      setCurrentUser(userData);
      localStorage.setItem("lms_current_user", JSON.stringify(userData));
      toast.success(`Welcome back, ${userData.name}!`);
    } catch (err) {
      console.error('❌ Login error:', err);
      const errorMessage = err instanceof Error ? err.message : "Login failed. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    
    try {
      setCurrentUser(null);
      localStorage.removeItem("lms_current_user");
      toast.info("You have been logged out successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      toast.error("Logout failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, isLoading, error, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
