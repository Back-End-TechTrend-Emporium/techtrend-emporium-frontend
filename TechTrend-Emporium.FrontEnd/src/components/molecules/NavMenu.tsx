import { Link } from "react-router-dom";

export type NavItem = { key: string; label: string; href: string };

export default function NavMenu({ items }: { items: NavItem[] }) {
  return (
    <nav aria-label="Primary" className="hidden md:block">
      <ul className="flex items-center gap-8 text-sm">
        {items.map((n) => (
          <li key={n.key}>
            <Link
              to={n.href}
              className="font-medium text-neutral-700 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-black/20"
            >
              {n.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
