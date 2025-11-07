import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function RequireRole({ children, roles }: { children: ReactNode; roles: string[] }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const hasUser = Boolean(user);
  // Normalize backend role to allow flexible matching (e.g. 'Employee', 'employee', 'SuperAdmin')
  const normalizedRole = (user?.role ?? "").toString().toLowerCase();
  const hasRole = hasUser && roles.some((r) => normalizedRole.includes(r.toLowerCase()));

  // Run effect unconditionally to respect the rules of hooks.
  const [countdown, setCountdown] = useState<number>(6);
  useEffect(() => {
    // If not authenticated: show countdown and redirect when it reaches 0
    if (!hasUser) {
      setCountdown(6);
      const id = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            clearInterval(id);
            navigate("/", { replace: true });
            return 0;
          }
          return c - 1;
        });
      }, 1000);
      return () => clearInterval(id);
    }

    // If authenticated but missing role: redirect immediately
    if (hasUser && !hasRole) {
      navigate("/", { replace: true });
    }
    return;
  }, [hasUser, hasRole, navigate]);

  if (!hasUser) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/70">
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-8 max-w-xl mx-4 w-full text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white">
              {/* simple spinner */}
              <svg className="w-6 h-6 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
            </div>

            <h1 className="text-2xl font-semibold">Acceso restringido</h1>
            <p className="text-neutral-600 dark:text-neutral-300">No estás autenticado. Serás redirigido a la página principal en unos segundos.</p>
            <p className="text-sm text-neutral-500">Si crees que esto es un error, inicia sesión e intenta de nuevo.</p>

            <div className="mt-4 flex gap-3">
              <a href="/login" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:opacity-95">Iniciar sesión</a>
              <button onClick={() => navigate("/", { replace: true })} className="inline-flex items-center px-4 py-2 border rounded">Ir a la página</button>
            </div>

            <p className="text-xs text-neutral-400 mt-3" aria-live="polite">Redirigiendo automáticamente en <strong className="text-sm">{countdown}s</strong>…</p>
          </div>
        </div>
      </div>
    );
  }

  if (hasUser && !hasRole) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50">
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-8 max-w-lg mx-4 w-full text-center">
          <h1 className="text-2xl font-semibold mb-2">Acceso denegado</h1>
          <p className="text-neutral-600 dark:text-neutral-300">No tienes permisos para acceder a esta sección. Serás redirigido a la página principal.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
