import React, { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
      }
    } catch (error) {
      console.warn("Failed to read token from localStorage:", error);
    }
  }, []);

  const login = (token: string) => {
    setToken(token);
    try {
      localStorage.setItem("token", token);
    } catch (error) {
      console.warn("Failed to store token in localStorage:", error);
    }
  };

  const logout = () => {
    setToken(null);
    try {
      localStorage.removeItem("token");
    } catch (error) {
      console.warn("Failed to remove token from localStorage:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
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
