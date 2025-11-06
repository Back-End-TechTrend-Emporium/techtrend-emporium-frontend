// src/App.tsx
import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Header from "./components/organisms/Header";
import type { UserLike } from "./components/molecules/UserDropdown";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import RegisterPage from "./pages/RegisterPage"; // Register screen
import EmployeePortal from "./pages/EmployeePortal";

export default function App() {
  // Global authenticated user (null = guest)
  const [user, setUser] = useState<UserLike | null>(null);

  // Programmatic navigation helper from react-router
  const navigate = useNavigate();

  // Rehydrate session from localStorage on first mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = (localStorage.getItem("username") || undefined) as string | undefined;
    const role = localStorage.getItem("role") as UserLike["role"] | null;
    if (token && name && role) setUser({ id: "u1", name, role });
  }, []);

  // Header callbacks (search and account/cart actions, mocked for now)
  const handleSearch = (q: string) => console.log("search:", q);

  // Clear local session and go home
  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/", { replace: true });
  };

  // Open login/register flows
  const handleSignIn = () => navigate("/login");
  const handlePortal = () => navigate("/employee-portal");

  // Simple stubs for header UI interactions
  const handleSelectCurrency = () => console.log("open currency selector");
  const handleLogoClick = () => navigate("/");

  // Role helpers
  const isEmployee = user?.role === "employee";
  const isAdmin = user?.role === "admin";

  // If an employee/admin hits "/", redirect them to the employee portal
  const homeElement = isEmployee || isAdmin ? (
    <Navigate to="/employee-portal" replace />
  ) : (
    <HomePage />
  );

  // Protect the employee portal route: only employee/admin allowed
  const portalElement = isEmployee || isAdmin ? (
    <div className="p-8 text-xl">Employee portal</div>
  ) : (
    <Navigate to="/" replace />
  );

  return (
    <>
      {/* Global header shared by all pages */}
      <Header
        currency="USD"
        user={user}
        cartCount={3}
        wishlistCount={1}
        onSearch={handleSearch}
        onLogout={handleLogout}
        onSignIn={handleSignIn}
        onGoToCart={() => console.log("go to cart")}
        onGoToWishlist={() => console.log("go to wishlist")}
        onGoToPortal={handlePortal}
        onSelectCurrency={handleSelectCurrency}
        onLogoClick={handleLogoClick}
      />

      {/* Application routes */}
      <Routes>
        {/* Public home (auto-redirects to portal if employee/admin) */}
        <Route path="/" element={homeElement} />

        {/* Login: on success, persist session and route by role */}
        <Route
          path="/login"
          element={
            <RequireAuth>
              <RequireRole roles={["Employee", "SuperAdmin"]}>
                <EmployeePortal />
              </RequireRole>
            </RequireAuth>
          }
        />
                {/* Register (Create account) */}
        <Route path="/register" element={<RegisterPage />} />

        {/* Forgot password / Recovery flow */}
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Protected employee/admin area */}
        <Route path="/employee-portal" element={portalElement} />

        {/* Fallback: any unknown path goes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
