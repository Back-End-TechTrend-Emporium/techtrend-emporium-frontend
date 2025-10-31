import React, { createContext, useContext, useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { authFetch } from "../lib/api";

export type User = {
  id: string;
  name: string;
  email?: string;
  role?: string;
  avatarUrl?: string;
};

export type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const storedToken = localStorage.getItem("jwt_token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        const parsed = JSON.parse(storedUser);
        // normalize stored user shape
        const normalized = {
          id: parsed.id ?? parsed._id ?? parsed.email ?? "",
          name: parsed.name ?? parsed.username ?? parsed.email ?? "",
          email: parsed.email ?? undefined,
          role: parsed.role ?? undefined,
          avatarUrl: parsed.avatarUrl ?? undefined,
        } as User;
        setUser(normalized);
      } catch {
        setUser(null);
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await authFetch<{ token: string; user?: any }>("/api/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      const token = data.token;
      const parsed = data.user ?? {};
      const normalized: User = {
        id: parsed.id ?? parsed._id ?? parsed.email ?? "",
        name: parsed.name ?? parsed.username ?? parsed.email ?? "",
        email: parsed.email ?? undefined,
        role: parsed.role ?? undefined,
        avatarUrl: parsed.avatarUrl ?? undefined,
      };
      setToken(token);
      setUser(normalized);
      localStorage.setItem("jwt_token", token);
      localStorage.setItem("user", JSON.stringify(normalized));
      queryClient.clear();
    } catch (err: any) {
      setError(err?.message ?? "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await authFetch<{ token: string; user?: any }>("/api/auth", {
        method: "POST",
        body: JSON.stringify({ email, username, password }),
      });
      const token = data.token;
      const parsed = data.user ?? {};
      const normalized: User = {
        id: parsed.id ?? parsed._id ?? parsed.email ?? "",
        name: parsed.name ?? parsed.username ?? parsed.email ?? "",
        email: parsed.email ?? undefined,
        role: parsed.role ?? undefined,
        avatarUrl: parsed.avatarUrl ?? undefined,
      };
      setToken(token);
      setUser(normalized);
      localStorage.setItem("jwt_token", token);
      localStorage.setItem("user", JSON.stringify(normalized));
      queryClient.clear();
    } catch (err: any) {
      setError(err?.message ?? "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await authFetch("/api/logout", { method: "POST" });
    } catch {
      // ignore errors on logout
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("user");
    queryClient.clear();
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
