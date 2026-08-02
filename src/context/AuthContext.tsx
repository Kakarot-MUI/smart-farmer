'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

interface User {
  name: string;
  phone: string;
  village?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (phone: string, password: string) => boolean;
  signup: (name: string, phone: string, village: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const USERS_KEY = 'cropadvisor-users';
const SESSION_KEY = 'cropadvisor-session';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    try {
      const session = localStorage.getItem(SESSION_KEY);
      if (session) {
        setUser(JSON.parse(session));
      }
    } catch {
      // ignore
    }
    setIsLoading(false);
  }, []);

  const getUsers = (): Record<string, { name: string; phone: string; village: string; password: string }> => {
    try {
      const data = localStorage.getItem(USERS_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  };

  const login = (phone: string, password: string): boolean => {
    const users = getUsers();
    const foundUser = users[phone];

    if (foundUser && foundUser.password === password) {
      const sessionUser: User = {
        name: foundUser.name,
        phone: foundUser.phone,
        village: foundUser.village,
      };
      setUser(sessionUser);
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
      return true;
    }
    return false;
  };

  const signup = (name: string, phone: string, village: string, password: string): boolean => {
    const users = getUsers();

    // Check if phone already registered
    if (users[phone]) {
      return false;
    }

    users[phone] = { name, phone, village, password };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    // Auto login after signup
    const sessionUser: User = { name, phone, village };
    setUser(sessionUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
