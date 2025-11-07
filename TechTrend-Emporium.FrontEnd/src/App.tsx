// src/App.tsx
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import Header from "./components/organisms/Header";
import { useAuth } from "./auth/AuthContext";
import type { UserLike } from "./components/molecules/UserDropdown";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import RegisterPage from "./pages/RegisterPage";
import EmployeePortal from "./pages/EmployeePortal";
import CreateProductPage from "./pages/CreateProductPage";
import CreateCategoryPage from "./pages/CreateCategoryPage";

import MyOrdersPage from "./pages/MyOrdersPage";
import OrderDetailPage from "./pages/OrderDetailPage";

import { FavoritesProvider, useFavorites } from "./context/FavoritesContext";
import FavoritesPage from "./pages/FavoritesPage";
import ProductDetailPage from "./pages/ProductDetailPage";

function HeaderWithFavorites({
  user,
  onSearch,
  onGoToCart,
  onGoToWishlist,
  onSelectCurrency,
  onLogoClick,
}: {
  user: UserLike | null;
  onSearch: (q: string) => void;
  onGoToCart: () => void;
  onGoToWishlist: () => void;
  onSelectCurrency: () => void;
  onLogoClick: () => void;
}) {
  const { items } = useFavorites();
  return (
    <Header
      currency="USD"
      user={user}
      cartCount={3}
      wishlistCount={items.length}
      onSearch={onSearch}
      onGoToCart={onGoToCart}
      onGoToWishlist={onGoToWishlist}
      onSelectCurrency={onSelectCurrency}
      onLogoClick={onLogoClick}
    />
  );
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const { user: authUser } = useAuth();

  const user: UserLike | null = authUser
    ? (() => {
        const raw = (authUser.role ?? "").toString().toLowerCase();
        let mapped: UserLike["role"] = "shopper";
        if (raw.includes("employee")) mapped = "employee";
        else if (raw.includes("superadmin") || raw.includes("admin")) mapped = "admin";

        return {
          id: authUser.id,
          name: authUser.name,
          avatarUrl: authUser.avatarUrl,
          role: mapped,
        };
      })()
    : null;

  const handleSearch = (q: string) => console.log("search:", q);
  const handleSelectCurrency = () => console.log("open currency selector");
  const handleLogoClick = () => navigate("/");
  const goCart = () => navigate("/my-orders");
  const goWishlist = () => navigate("/favorites");

  const isEmployee = !!user && user.role === "employee";
  const isAdmin = !!user && user.role === "admin";
  const isShopper = !!user && user.role === "shopper";

  const showHeader = location.pathname !== "/login" && location.pathname !== "/forgot-password";

  return (
    <FavoritesProvider>
      {showHeader && (
        <>
          <style>{`header button[aria-controls="mobile-menu"]{display:none !important;}`}</style>
          <HeaderWithFavorites
            user={user}
            onSearch={handleSearch}
            onGoToCart={goCart}
            onGoToWishlist={goWishlist}
            onSelectCurrency={handleSelectCurrency}
            onLogoClick={handleLogoClick}
          />
        </>
      )}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route
          path="/employee-portal"
          element={isEmployee || isAdmin ? <EmployeePortal /> : <Navigate to="/" replace />}
        />
        <Route
          path="/create-product"
          element={isEmployee || isAdmin ? <CreateProductPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/create-category"
          element={isEmployee || isAdmin ? <CreateCategoryPage /> : <Navigate to="/" replace />}
        />

        <Route path="/favorites" element={<FavoritesPage />} />



  {/* Product detail */}
  <Route path="/product/:id" element={<ProductDetailPage />} />


        <Route
          path="/my-orders"
          element={
            isShopper ? <MyOrdersPage /> : user ? <Navigate to="/" replace /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/my-orders/:orderId"
          element={
            isShopper ? <OrderDetailPage /> : user ? <Navigate to="/" replace /> : <Navigate to="/login" replace />
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </FavoritesProvider>
  );
}
