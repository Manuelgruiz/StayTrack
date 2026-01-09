import { useState, useEffect } from "react";
import { Activity, Menu, X, LogOut, LayoutDashboard, Target, Home as HomeIcon, User } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { isAuthed, logout } from "../api/auth";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthed());
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Update auth status on route change or mount
  useEffect(() => {
    setIsLoggedIn(isAuthed());
  }, [pathname]);

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setOpen(false);
    navigate("/login");
  };

  const navLink = (to: string, label: string, Icon?: any) => (
    <Link
      to={to}
      onClick={() => setOpen(false)}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 font-medium ${pathname === to
        ? "bg-black text-white shadow-lg shadow-black/10"
        : "text-gray-600 hover:bg-gray-100"
        }`}
    >
      {Icon && <Icon size={18} />}
      {label}
    </Link>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/70 backdrop-blur-xl border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center transition-transform group-hover:scale-110">
            <Activity className="text-white" size={20} />
          </div>
          <span className="font-black text-2xl tracking-tight text-gray-900">StayTrack</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2">
          {navLink("/", "Home", HomeIcon)}

          {isLoggedIn ? (
            <>
              {navLink("/dashboard", "Dashboard", LayoutDashboard)}
              {navLink("/goals", "Goals", Target)}
              {navLink("/profile", "Profile", User)}
              <div className="w-px h-6 bg-gray-200 mx-2" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-red-500 hover:bg-red-50 transition-all font-bold"
              >
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <>
              {navLink("/login", "Login")}
              <Link
                to="/register"
                className="ml-2 px-6 py-2.5 rounded-xl bg-black text-white font-bold hover:bg-gray-800 transition-all shadow-lg shadow-black/10 active:scale-95"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 rounded-xl bg-gray-50 text-gray-600"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-white border-b border-gray-100 p-6 flex flex-col gap-3 shadow-2xl animate-in slide-in-from-top-5">
          {navLink("/", "Home", HomeIcon)}
          {isLoggedIn ? (
            <>
              {navLink("/dashboard", "Dashboard", LayoutDashboard)}
              {navLink("/goals", "Goals", Target)}
              {navLink("/profile", "Profile", User)}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-4 rounded-xl text-red-600 bg-red-50 font-bold mt-2"
              >
                <LogOut size={20} />
                Logout
              </button>
            </>
          ) : (
            <>
              {navLink("/login", "Login")}
              {navLink("/register", "Create Account")}
            </>
          )}
        </div>
      )}
    </nav>
  );
}
