// src/App.tsx
import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/organisms/Header";
import type { UserLike } from "./components/molecules/UserDropdown";
import HomePage from "./pages/HomePage";

export default function App() {
  const [user, setUser] = useState<UserLike | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = (localStorage.getItem("username") || undefined) as string | undefined;
    const role = localStorage.getItem("role") as UserLike["role"] | null;
    if (token && name && role) setUser({ id: "u1", name, role });
  }, []);

  const handleSearch = (q: string) => console.log("search:", q);
  const handleLogout = () => { localStorage.clear(); setUser(null); };
  const handleSignIn = () => {
    localStorage.setItem("token", "t");
    localStorage.setItem("username", "Jengrik");
    localStorage.setItem("role", "shopper");
    setUser({ id: "c1", name: "Jengrik", role: "shopper" });
  };
  const handlePortal = () => console.log("navigate to /employee-portal");
  const handleSelectCurrency = () => console.log("open currency selector");
  const handleLogoClick = () => console.log("navigate to /");

  // Dev toggles
  const setGuest = () => { localStorage.clear(); setUser(null); };
  const setShopper = () => { localStorage.setItem("token","t"); localStorage.setItem("username","Jengrik"); localStorage.setItem("role","shopper"); setUser({id:"c1",name:"Jengrik",role:"shopper"}); };
  const setEmployee = () => { localStorage.setItem("token","t"); localStorage.setItem("username","Employee"); localStorage.setItem("role","employee"); setUser({id:"e1",name:"Employee",role:"employee"}); };
  const setAdmin = () => { localStorage.setItem("token","t"); localStorage.setItem("username","Admin"); localStorage.setItem("role","admin"); setUser({id:"a1",name:"Admin",role:"admin"}); };

  // Flags de rol
  const isGuest = !user;
  const isShopper = user?.role === "shopper";
  const isEmployee = user?.role === "employee";
  const isAdmin = user?.role === "admin";

  // Guards de rutas
  const homeElement = (isEmployee || isAdmin) ? (
    <Navigate to="/employee-portal" replace />
  ) : (
    <HomePage />
  );

  const portalElement = (isEmployee || isAdmin) ? (
    <div className="p-8 text-xl">Employee portal</div>
  ) : (
    <Navigate to="/" replace />
  );

  return (
    <>
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

      <Routes>
        <Route path="/" element={homeElement} />
        <Route path="/employee-portal" element={portalElement} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Dev toggles */}
      <div className="fixed bottom-4 right-4 z-50 flex gap-2 rounded-xl border border-neutral-200 bg-white/90 p-2 shadow">
        <button className="rounded-md border px-3 py-1 text-sm hover:bg-neutral-100" onClick={setShopper}>Shopper</button>
        <button className="rounded-md border px-3 py-1 text-sm hover:bg-neutral-100" onClick={setEmployee}>Employee</button>
      </div>
    </>
  );
}
