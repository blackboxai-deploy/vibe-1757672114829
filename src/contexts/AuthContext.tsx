"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "radiologist" | "reviewer";
  specialization?: string;
  avatar?: string;
  status: "active" | "offline";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, role: string) => Promise<boolean>;
  logout: () => void;
  updateUserStatus: (status: "active" | "offline") => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved user session
    const savedUser = localStorage.getItem("teleradiology_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error parsing saved user:", error);
        localStorage.removeItem("teleradiology_user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, role: string): Promise<boolean> => {
    setLoading(true);
    
    // Simulate API login with demo users
    const demoUsers: Record<string, User> = {
      "admin@teleradiology.com": {
        id: "admin-1",
        email: "admin@teleradiology.com",
        name: "Dr. Sarah Wilson",
        role: "admin",
        specialization: "Administrative Director",
        status: "active"
      },
      "radiologist@teleradiology.com": {
        id: "rad-1",
        email: "radiologist@teleradiology.com",
        name: "Dr. Michael Chen",
        role: "radiologist",
        specialization: "Diagnostic Radiology",
        status: "active"
      },
      "reviewer@teleradiology.com": {
        id: "rev-1",
        email: "reviewer@teleradiology.com",
        name: "Dr. Emily Rodriguez",
        role: "reviewer",
        specialization: "Quality Assurance",
        status: "active"
      }
    };

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const userData = demoUsers[email];
    if (userData && password === "demo123" && userData.role === role) {
      setUser(userData);
      localStorage.setItem("teleradiology_user", JSON.stringify(userData));
      setLoading(false);
      return true;
    }

    setLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("teleradiology_user");
  };

  const updateUserStatus = (status: "active" | "offline") => {
    if (user) {
      const updatedUser = { ...user, status };
      setUser(updatedUser);
      localStorage.setItem("teleradiology_user", JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUserStatus }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}