import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function RequireRole({ children, roles }: { children: ReactNode; roles: string[] }) {
  const { user } = useAuth();
  const has = user && roles.includes(user.role ?? "");
  if (!has) return <Navigate to="/" replace />;
  return <>{children}</>;
}
