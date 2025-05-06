import React, { createContext, useContext, useState, useEffect } from 'react';

// User types
export type UserRole = 'CEO' | 'LEADERSHIP TEAM' | 'PE & BOD';

export interface User {
  email: string;
  role: UserRole;
}

// Context type
interface AuthContextType {
  user: User | null;
  login: (email: string, role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
});

// Hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored user on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('advantageCEO_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user', error);
        localStorage.removeItem('advantageCEO_user');
      }
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = (email: string, role: UserRole) => {
    const newUser = { email, role };
    setUser(newUser);
    localStorage.setItem('advantageCEO_user', JSON.stringify(newUser));
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('advantageCEO_user');
  };

  // Determine if user is authenticated
  const isAuthenticated = user !== null;

  // Provider values
  const value = {
    user,
    login,
    logout,
    isAuthenticated,
  };

  // Show nothing while loading
  if (isLoading) {
    return null;
  }

  // Return provider with value
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};