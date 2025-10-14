import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Layout({ children }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const dropdownRef = useRef(null);

  const navItems = [];

  if(localStorage.getItem("token")) {
    navItems.push(
      { name: "Dashboard", path: "/dashboard" },
      { name: "Investments", path: "/investments" },
      { name: "Wealth Blueprint", path: "/Wealthblueprint" },
      { name: "Articles", path: "/articles" },
    );
  } else {
    navItems.push(
      { name: "Home", path: "/" },
      { name: "About", path: "/about" },
      { name: "Wealth Blueprint", path: "/Wealthblueprint" },
      { name: "Articles", path: "/articles" },
    );
  }

  // Close profile dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-cream text-black">
      {/* Header */}
      <header className="bg-black text-cream shadow-md">
        <nav className="flex justify-between items-center h-20 px-8">
          {/* Logo */}
          <div className="text-2xl font-bold tracking-wide pl-2">BetaNest</div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 items-center">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <span
                  className={`cursor-pointer pb-1 transition ${
                    router.pathname === item.path
                      ? "border-b-2 border-taupe text-taupe"
                      : "hover:text-warm-gray"
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            ))}
          </div>
          <div className="hidden md:flex gap-8 items-center">
            {/* Auth section */}
            {!user ? (
              <Link href="/login">
                <span className="btn-primary cursor-pointer">Login</span>
              </Link>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  className="px-3 py-1 rounded bg-taupe text-black font-semibold hover:bg-warm-gray"
                  onClick={() => setProfileOpen(!profileOpen)}
                >
                  {user?.firstName?.charAt(0) + user?.lastName?.charAt(0) || "Profile"}
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-black text-sm hover:bg-cream"
                      onClick={() => setProfileOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-cream"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </nav>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className="md:hidden bg-black border-t border-warm-gray">
            <ul className="flex flex-col px-6 py-3 space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link href={item.path}>
                    <span
                      onClick={() => setMenuOpen(false)}
                      className={`block py-2 px-3 rounded cursor-pointer ${
                        router.pathname === item.path
                          ? "bg-taupe text-black font-semibold"
                          : "hover:bg-warm-gray hover:text-cream"
                      }`}
                    >
                      {item.name}
                    </span>
                  </Link>
                </li>
              ))}

              {!user ? (
                <Link href="/login">
                  <span
                    onClick={() => setMenuOpen(false)}
                    className="block py-2 px-3 rounded btn-primary"
                  >
                    Login
                  </span>
                </Link>
              ) : (
                <>
                  <Link href="/profile">
                    <span
                      onClick={() => setMenuOpen(false)}
                      className="block py-2 px-3 rounded hover:bg-warm-gray hover:text-cream"
                    >
                      Profile
                    </span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 px-3 rounded hover:bg-warm-gray hover:text-cream"
                  >
                    Logout
                  </button>
                </>
              )}
            </ul>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">{children}</main>

      {/* Footer */}
      <footer className="bg-black text-cream flex items-center justify-center h-20 px-6">
        <p className="text-center text-sm md:text-base">
          ©2035 by Harsh Patel.
        </p>
      </footer>
    </div>
  );
}
