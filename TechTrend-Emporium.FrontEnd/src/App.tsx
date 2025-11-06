// src/App.tsx
// react imports
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Header from "./components/organisms/Header";
import RequireAuth from "./auth/RequireAuth";
import RequireRole from "./auth/RequireRole";
import { useAuth } from "./auth/AuthContext";
import type { UserLike } from "./components/molecules/UserDropdown";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import RegisterPage from "./pages/RegisterPage"; // Register screen
import EmployeePortal from "./pages/EmployeePortal";

export default function App() {
  // Programmatic navigation helper from react-router
  const navigate = useNavigate();

  // Use the central AuthContext for user/session state (no legacy local state)
  const { user: authUser, logout } = useAuth();

  // Map AuthContext user shape to the local UserLike expected by Header
  const user: UserLike | null = authUser
    ? (() => {
        const raw = (authUser.role ?? "").toString().toLowerCase();
        // Map backend roles like 'SuperAdmin' or 'Employee' to our smaller set: shopper/employee/admin
        let mapped: UserLike["role"] = "shopper";
        if (raw.includes("Employee")) mapped = "employee";
        else if (raw.includes("SuperAdmin") || raw.includes("admin")) mapped = "admin";

        return {
          id: authUser.id,
          name: authUser.name,
          avatarUrl: authUser.avatarUrl,
          role: mapped,
        };
      })()
    : null;

  // Header callbacks (search and account/cart actions, mocked for now)
  const handleSearch = (q: string) => console.log("search:", q);

  // Clear session via AuthContext and go home
  const handleLogout = async () => {
    await logout();
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
  const portalElement = isEmployee || isAdmin ? <EmployeePortal /> : <Navigate to="/" replace />;

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

        {/* Login screen */}
        <Route path="/login" element={<LoginPage />} />
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
