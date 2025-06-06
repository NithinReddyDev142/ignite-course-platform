
// Dummy authentication service for development
export interface DummyUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'instructor' | 'student';
  avatar?: string;
}

// In-memory storage for dummy users
const dummyUsers: DummyUser[] = [
  {
    id: '1',
    name: 'John Student',
    email: 'student@example.com',
    password: 'password123',
    role: 'student',
    avatar: ''
  },
  {
    id: '2',
    name: 'Jane Instructor',
    email: 'instructor@example.com',
    password: 'password123',
    role: 'instructor',
    avatar: ''
  },
  {
    id: '3',
    name: 'Mike Student',
    email: 'mike@student.com',
    password: 'password123',
    role: 'student',
    avatar: ''
  },
  {
    id: '4',
    name: 'Sarah Teacher',
    email: 'sarah@instructor.com',
    password: 'password123',
    role: 'instructor',
    avatar: ''
  }
];

export const dummyAuthService = {
  // Login function
  login: async (email: string, password: string): Promise<DummyUser> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = dummyUsers.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as DummyUser;
  },

  // Register function
  register: async (name: string, email: string, password: string, role: 'instructor' | 'student'): Promise<DummyUser> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if user already exists
    const existingUser = dummyUsers.find(u => u.email === email);
    if (existingUser) {
      throw new Error('User already exists');
    }
    
    // Create new user
    const newUser: DummyUser = {
      id: (dummyUsers.length + 1).toString(),
      name,
      email,
      password,
      role,
      avatar: ''
    };
    
    dummyUsers.push(newUser);
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword as DummyUser;
  },

  // Get all users (for testing)
  getAllUsers: () => {
    return dummyUsers.map(({ password, ...user }) => user);
  }
};
