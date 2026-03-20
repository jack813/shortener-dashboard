"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";

interface AuthState {
  isLoggedIn: boolean;
  username: string | null;
}

interface AuthContextType {
  isLoggedIn: boolean;
  username: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "shortener-auth";
const SIDEBAR_COLLAPSED_KEY = "sidebar-collapsed";

function getStoredAuth(): AuthState {
  if (typeof window === "undefined") {
    return { isLoggedIn: false, username: null };
  }
  const stored = localStorage.getItem(AUTH_STORAGE_KEY);
  if (stored) {
    try {
      const data = JSON.parse(stored);
      if (data.isLoggedIn && data.username) {
        return { isLoggedIn: true, username: data.username };
      }
    } catch {
      // ignore parse errors
    }
  }
  return { isLoggedIn: false, username: null };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({ isLoggedIn: false, username: null });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 读取 localStorage 中的登录状态
    const storedAuth = getStoredAuth();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Necessary for reading localStorage after hydration in Next.js
    setAuthState(storedAuth);
    setIsLoading(false);
  }, []);

  const login = useCallback((user: string, password: string) => {
    // password parameter kept for interface compatibility, validation not implemented in demo
    void password;
    const data = { isLoggedIn: true, username: user };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
    setAuthState({ isLoggedIn: true, username: user });
    return true;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setAuthState({ isLoggedIn: false, username: null });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: authState.isLoggedIn,
        username: authState.username,
        isLoading,
        login,
        logout,
      }}
    >
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

export { SIDEBAR_COLLAPSED_KEY };