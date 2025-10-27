import { useState } from "react";
import { Activity, Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  const link = (to: string, label: string) => (
    <Link
      to={to}
      onClick={() => setOpen(false)}
      className={`px-3 py-2 rounded-full transition ${
        pathname === to
          ? "bg-fitnessAccent text-white"
          : "text-fitnessText hover:bg-black/5"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-black/5">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Activity className="text-fitnessAccent" />
          <span className="font-semibold">StayTrack</span>
        </Link>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          <Menu />
        </button>

        <div className="hidden md:flex items-center gap-2">
          {link("/", "Home")}
          {link("/login", "Log in")}
          {link("/register", "Create account")}
          {link("/dashboard", "Dashboard")}
        </div>
      </div>

      {open && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-2 bg-white border-t border-black/5">
          {link("/", "Home")}
          {link("/login", "Log in")}
          {link("/register", "Create account")}
          {link("/dashboard", "Dashboard")}
        </div>
      )}
    </nav>
  );
}
