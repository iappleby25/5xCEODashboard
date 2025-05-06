import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define types for user roles
export type UserRole = 'CEO' | 'LEADERSHIP TEAM' | 'PE & BOD';

// Interface for the authenticated user
export interface AuthUser {
  email: string;
  role: UserRole;
  company?: string;
}

// Interface for auth context
interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hardcoded user credentials for the demo
const USERS: Record<string, { password: string; role: UserRole; company?: string }> = {
  'ceo@company.com': { 
    password: 'password', 
    role: 'CEO',
    company: 'GlobalSolutions'  // This CEO belongs to GlobalSolutions
  },
  'leader@company.com': { 
    password: 'password', 
    role: 'LEADERSHIP TEAM',
    company: 'EcoWave'  // This leader belongs to EcoWave
  },
  'pe@firm.com': { 
    password: 'password', 
    role: 'PE & BOD'
    // No company specified as PE & BOD can see all companies
  }
};

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  // Function to check credentials and log in the user
  const login = async (email: string, password: string): Promise<boolean> => {
    // Check if the user exists and the password is correct
    if (USERS[email] && USERS[email].password === password) {
      // Set the authenticated user
      setUser({
        email,
        role: USERS[email].role,
        company: USERS[email].company
      });
      return true;
    }
    return false;
  };

  // Function to log out the user
  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};