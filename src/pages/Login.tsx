
import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { sampleUsers } from "@/lib/sample-data";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("student");
  const [tab, setTab] = useState("login"); // "login" or "register"
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the page user was trying to access before being redirected to login
  const from = location.state?.from || "/dashboard";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Attempting to login with:", { email, password });
      await login(email, password);
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      // Error is handled in the AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Attempting to register with:", { name, email, password, role });
      await register(name, email, password, role);
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Registration error:", error);
      // Error is handled in the AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const setDemoUser = (userType: "instructor" | "student") => {
    const demoUser = sampleUsers.find(user => user.role === userType);
    if (demoUser) {
      setEmail(demoUser.email);
      setPassword("password"); // Any password works in this demo
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold text-primary inline-block">
            EduLearn LMS
          </Link>
          <p className="text-muted-foreground mt-2">
            Your gateway to knowledge and professional development
          </p>
        </div>

        <Tabs defaultValue="login" value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full mb-4">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          <Card>
            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <CardHeader>
                  <CardTitle>Welcome back</CardTitle>
                  <CardDescription>
                    Sign in to your account to continue
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <a href="#" className="text-sm text-primary">
                        Forgot password?
                      </a>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    <p>Demo accounts (click to use):</p>
                    <div className="flex gap-2 mt-1">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setDemoUser("instructor")}
                      >
                        Instructor
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setDemoUser("student")}
                      >
                        Student
                      </Button>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                        Signing in...
                      </span>
                      : 
                      "Sign In"
                    }
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister}>
                <CardHeader>
                  <CardTitle>Create an account</CardTitle>
                  <CardDescription>
                    Enter your details to get started
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Full Name</Label>
                    <Input
                      id="register-name"
                      placeholder="John Smith"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="account-type">Account Type</Label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <Button 
                        type="button" 
                        variant={role === "student" ? "default" : "outline"} 
                        className="relative border-2 hover:border-primary cursor-pointer"
                        onClick={() => setRole("student")}
                      >
                        <input
                          type="radio"
                          name="account-type"
                          value="student"
                          className="sr-only"
                          checked={role === "student"}
                          onChange={() => setRole("student")}
                        />
                        <span>Student</span>
                      </Button>
                      
                      <Button 
                        type="button" 
                        variant={role === "instructor" ? "default" : "outline"} 
                        className="relative border-2 hover:border-primary cursor-pointer"
                        onClick={() => setRole("instructor")}
                      >
                        <input
                          type="radio"
                          name="account-type"
                          value="instructor"
                          className="sr-only"
                          checked={role === "instructor"}
                          onChange={() => setRole("instructor")}
                        />
                        <span>Instructor</span>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    By creating an account, you agree to our{" "}
                    <a href="#" className="text-primary">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-primary">
                      Privacy Policy
                    </a>
                    .
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                        Creating Account...
                      </span>
                      : 
                      "Create Account"
                    }
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Card>
        </Tabs>

        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} EduLearn LMS. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
