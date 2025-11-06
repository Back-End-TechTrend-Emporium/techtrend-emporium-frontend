import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../atoms/Icon";
import Avatar from "../atoms/Avatar";

/** NEW: roles used by F-102 */
export type Role = "shopper" | "employee" | "admin";

/** UPDATED: include role */
export type UserLike = { id: string; name: string; avatarUrl?: string; role?: Role };

export function UserDropdown({
  user,
  onLogout,
  onGoToPortal,
}: {
  user: UserLike;
  onLogout?: () => void;
  onGoToPortal?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const isEmployee = user.role === "employee" || user.role === "admin";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded-full px-2 py-1 text-sm hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-black/20"
      >
        {user.avatarUrl ? (
          <Avatar src={user.avatarUrl} size={24} />
        ) : (
          <Icon name="user" className="h-5 w-5" />
        )}
        <span className="inline-block font-medium text-neutral-800" title={user.name}>
          {user.name}
        </span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-lg"
        >
          <div className="px-3 py-2 text-sm text-neutral-600">
            Signed in as{" "}
            <span className="font-medium text-neutral-900">{user.name}</span>
            {user.role ? <span className="ml-1 text-neutral-500">({user.role})</span> : null}
          </div>

          {isEmployee && (
            <button
              role="menuitem"
              className="w-full px-3 py-2 text-left text-sm hover:bg-neutral-100"
              onClick={() => {
                setOpen(false);
                onGoToPortal?.();
              }}
            >
              Employee portal
            </button>
          )}

          <div className="my-1 h-px bg-neutral-200" />

          <button
            role="menuitem"
            className="w-full px-3 py-2 text-left text-sm hover:bg-neutral-100"
            onClick={() => {
              setOpen(false);
              onLogout?.();
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export function GuestDropdown({
  onSignIn,
  onSignUp,
}: {
  onSignIn?: () => void;
  onSignUp?: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open user menu"
        className="inline-flex items-center rounded-full p-2 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-black/20"
      >
        <Icon name="user" className="h-5 w-5" />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-lg"
        >
          <button
            role="menuitem"
            className="w-full px-3 py-2 text-left text-sm hover:bg-neutral-100"
            onClick={() => {
              setOpen(false);
              onSignIn?.();
            }}
          >
            Sign in
          </button>

          <button
            role="menuitem"
            className="w-full px-3 py-2 text-left text-sm hover:bg-neutral-100"
            onClick={() => {
              setOpen(false);
              onSignUp?.();
            }}
          >
            Create account
          </button>

          <div className="my-1 h-px bg-neutral-200" />

          {/* NEW: Forgot password directo */}
          <Link
            to="/forgot-password"
            role="menuitem"
            className="block w-full px-3 py-2 text-left text-sm hover:bg-neutral-100"
            onClick={() => setOpen(false)}
          >
            Forgot password
          </Link>
        </div>
      )}
    </div>
  );
}
