"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";

interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  username: string | null;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "shortener-auth-user";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://shortener.0x1.in";
const OAUTH_URL = process.env.NEXT_PUBLIC_OAUTH_URL || "https://shortener.0x1.in/auth/github";
const LOGOUT_URL = "https://shortener.0x1.in/logout";

/**
 * Get stored user from localStorage
 */
function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(AUTH_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Store user in localStorage
 */
function storeUser(user: User | null) {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isLoggedIn: false,
    user: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // Even if we can't read HttpOnly cookie via JS, browser will send it with credentials: 'include'
      // So we always try to verify with the API
      try {
        // Verify session with API - browser automatically sends HttpOnly session cookie
        const response = await fetch(`${API_URL}/api/me`, {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          const userData = data.user;
          const user: User = {
            id: userData.id,
            name: userData.name || userData.login || "User",
            email: userData.email,
            avatar: userData.avatar,
          };
          setAuthState({ isLoggedIn: true, user });
          storeUser(user);
        } else {
          // Session invalid
          setAuthState({ isLoggedIn: false, user: null });
          storeUser(null);
        }
      } catch {
        // Network error, check cached user
        const cachedUser = getStoredUser();
        if (cachedUser) {
          setAuthState({ isLoggedIn: true, user: cachedUser });
        } else {
          setAuthState({ isLoggedIn: false, user: null });
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(() => {
    // Redirect to OAuth
    window.location.href = OAUTH_URL;
  }, []);

  const logout = useCallback(() => {
    // Clear local state
    storeUser(null);
    setAuthState({ isLoggedIn: false, user: null });
    // Redirect to server-side logout to clear HttpOnly cookie
    window.location.href = LOGOUT_URL;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: authState.isLoggedIn,
        user: authState.user,
        username: authState.user?.name || null,
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