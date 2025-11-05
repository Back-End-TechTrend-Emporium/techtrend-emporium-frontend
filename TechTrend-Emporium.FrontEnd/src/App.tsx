// src/App.tsx
import { AuthProvider } from "./auth/AuthContext";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/organisms/Header";
import RequireAuth from "./auth/RequireAuth";
import RequireRole from "./auth/RequireRole";
import HomePage from "./pages/HomePage";
import ShopList from "./pages/ShopList";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

export default function App() {
  // The AuthProvider exposes user and actions via context; App only declares routes and layout.
  return (
    <AuthProvider>
      <Header currency="USD" cartCount={0} wishlistCount={0} />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
  <Route path="/shop" element={<ShopList />} />
        <Route
          path="/employee-portal"
          element={
            <RequireAuth>
              <RequireRole roles={["employee", "admin"]}>
                <div className="p-8 text-xl">Employee portal</div>
              </RequireRole>
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
