// src/App.tsx
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Header from "./components/organisms/Header";
// import RequireAuth from "./auth/RequireAuth";
// import RequireRole from "./auth/RequireRole";
import { useAuth } from "./auth/AuthContext";
import type { UserLike } from "./components/molecules/UserDropdown";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import RegisterPage from "./pages/RegisterPage"; // Register screen
import EmployeePortal from "./pages/EmployeePortal";
import CreateProductPage from "./pages/CreateProductPage";
import CreateCategoryPage from "./pages/CreateCategoryPage";

// F-204
import MyOrdersPage from "./pages/MyOrdersPage";
import OrderDetailPage from "./pages/OrderDetailPage";

// F-205
import { FavoritesProvider, useFavorites } from "./context/FavoritesContext";
import FavoritesPage from "./pages/FavoritesPage";

/** Bridge so Header can read wishlist count from Favorites context */
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
  // const location = useLocation(); // not needed after removing rehydrate effect

  // Use the central AuthContext for user/session state (no legacy local state)
  const { user: authUser } = useAuth();

  // Map AuthContext user shape to the local UserLike expected by Header
  const user: UserLike | null = authUser
    ? (() => {
  const raw = (authUser.role ?? "").toString().toLowerCase();
  // Map backend roles like 'superadmin' or 'employee' (case-insensitive) to shopper/employee/admin
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

  // NOTE: AuthProvider already rehydrates from storage on mount.
  // Removed looping rehydrate effect that caused infinite renders.

  // Header handlers
  const handleSearch = (q: string) => console.log("search:", q);

  // Clear session via AuthContext and go home
  // Logout handler kept if needed by Header in future (currently not passed)
  // const handleLogout = async () => {
  //   await logout();
  //   navigate("/", { replace: true });
  // };

  // Simple stubs for header UI interactions
  const handleSelectCurrency = () => console.log("open currency selector");
  const handleLogoClick = () => navigate("/");
  const goCart = () => console.log("go to cart");
  const goWishlist = () => navigate("/favorites");

  // Role helpers
  const isEmployee = !!user && user.role === "employee";
  const isAdmin = !!user && user.role === "admin";
  const isShopper = !!user && user.role === "shopper";

  // Protect the employee portal route: only employee/admin allowed
  // const portalElement = isEmployee || isAdmin ? <EmployeePortal /> : <Navigate to="/" replace />; // unused

  return (
    <FavoritesProvider>
      <HeaderWithFavorites
        user={user}
        onSearch={handleSearch}
        onGoToCart={goCart}
        onGoToWishlist={goWishlist}
        onSelectCurrency={handleSelectCurrency}
        onLogoClick={handleLogoClick}
      />

      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Protected: employee/admin */}
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

        {/* F-205 */}
        <Route path="/favorites" element={<FavoritesPage />} />

        {/* Placeholder product detail */}
        <Route path="/product/:id" element={<div className="p-6">TODO: Product detail</div>} />

        {/* F-204: shopper-only */}
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

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </FavoritesProvider>
  );
}
