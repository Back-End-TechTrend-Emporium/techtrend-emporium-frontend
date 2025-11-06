import { useState } from "react";
import { CurrencyRail, ShippingBanner } from "../../molecules/TopRails";
import BrandLogo from "../../molecules/BrandLogo";
import NavMenu, { type NavItem } from "../../molecules/NavMenu";
import ActionIcon from "../../molecules/SearchBar/ActionIcon";
import SearchBar from "../../molecules/SearchBar";
import { GuestDropdown, UserDropdown, type UserLike } from "../../molecules/UserDropdown";
import Button from "../../atoms/Button";
import { useAuth } from "../../../auth/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

export type HeaderProps = {
  currency?: string;
  user?: UserLike | null;
  cartCount?: number;
  wishlistCount?: number;
  navItems?: NavItem[];
  onSearch?: (q: string) => void;
  onSelectCurrency?: () => void;
  onGoToCart?: () => void;
  onGoToWishlist?: () => void;
  onLogoClick?: () => void;
  // legacy/optional callbacks used by App.tsx
  onSignIn?: () => void;
  onLogout?: () => void;
  onGoToPortal?: () => void;
};

const defaultNav: NavItem[] = [
  { key: "shop-list", label: "Shop List", href: "#shop" },
  { key: "wishlist", label: "Wishlist", href: "#wishlist" },
];

export default function Header({
  currency,
  cartCount = 0,
  wishlistCount = 0,
  navItems = defaultNav,
  onSearch,
  onSelectCurrency,
  onGoToCart,
  onGoToWishlist,
  onLogoClick,
}: Partial<HeaderProps>) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const hideNativeCart = location.pathname.startsWith("/employee-portal");
  const roleStr = (user?.role ?? "").toString().toLowerCase();
  const isStaff = roleStr === "employee" || roleStr === "admin" || roleStr === "superadmin";
  const showShopperIcons = !isStaff && !hideNativeCart;
  // Remove shopper-only navigation entries for staff roles
  const effectiveNavItems = isStaff
    ? navItems.filter(i => i.key !== "shop-list" && i.key !== "wishlist")
    : navItems;

  const handleSignIn = () => navigate("/login");
  const handleSignUp = () => navigate("/register");
  const handleLogout = async () => { await logout(); navigate("/"); };
  const handlePortal = () => navigate("/employee-portal");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      {/* Utility rails */}
      <CurrencyRail currency={currency} onSelectCurrency={onSelectCurrency} />
      <ShippingBanner />
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between py-2 md:py-3">
          {/* Left: brand */}
          <BrandLogo onClick={onLogoClick} />
          {/* Center: nav */}
          <NavMenu items={effectiveNavItems} />
          {/* Right: controls */}
          <div className="flex items-center gap-3 md:gap-4">
            <ActionIcon name="search" ariaLabel="Search" onClick={() => setShowSearch(v => !v)} />
            {showShopperIcons && (
              <>
                <ActionIcon
                  name="heart"
                  ariaLabel="Wishlist"
                  onClick={onGoToWishlist}
                  count={wishlistCount}
                />
                <ActionIcon name="cart" ariaLabel="Cart" onClick={onGoToCart} count={cartCount} />
              </>
            )}
            {/* Account area */}
            {user ? (
              user.role === "employee" || user.role === "admin" ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-neutral-900">{user.name}</span>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="text-sm underline underline-offset-2 hover:opacity-80"
                  >
                    Logout
                  </button>
                  <Button size="sm" onClick={handlePortal}>
                    Employee Portal
                  </Button>
                </div>
              ) : (
                <UserDropdown user={user as any} onLogout={handleLogout} onGoToPortal={handlePortal} />
              )
            ) : (
              <GuestDropdown onSignIn={handleSignIn} onSignUp={handleSignUp} />
            )}
            {/* Mobile menu */}
            <button
              type="button"
              className="inline-flex items-center rounded-md border border-neutral-200 px-2 py-1 text-sm md:hidden focus:outline-none focus:ring-2 focus:ring-black/20"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              onClick={() => setMobileOpen(v => !v)}
            >
              Menu
            </button>
          </div>
        </div>
        {/* Search bar (full width on md+) */}
        <div className={`pb-3 md:pb-6 ${showSearch ? "block" : "hidden md:block"}`}>
          <SearchBar onSearch={onSearch} />
        </div>
        {/* Mobile nav duplication (optional) */}
        <div id="mobile-menu" className={`md:hidden ${mobileOpen ? "block" : "hidden"}`}>
          <nav aria-label="Mobile" className="border-t border-neutral-200 py-3">
            <ul className="flex flex-col gap-2 text-sm">
              {effectiveNavItems.map(n => (
                <li key={n.key}>
                  <a href={n.href} className="block rounded-md px-2 py-2 font-medium hover:bg-neutral-100">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
