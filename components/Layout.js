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
  // Contact form state
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactLoading, setContactLoading] = useState(false);
  const [contactResponse, setContactResponse] = useState(null);
  const [contactError, setContactError] = useState(null);

  // Contact form submit handler
  const handleContactSubmit = async (e) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    e.preventDefault();
    setContactResponse(null);
    setContactError(null);

    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
      setContactError("Please fill name, email and message.");
      return;
    }

    setContactLoading(true);
    try {
      const res = await fetch(`${API_URL}/apiv1/users/contact-us`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactName.trim(),
          email: contactEmail.trim(),
          message: contactMessage.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setContactError(data?.message || "Failed to send message");
      } else {
        setContactResponse(data?.message || "Message sent successfully");
        setContactName("");
        setContactEmail("");
        setContactMessage("");
      }
    } catch (err) {
      console.error("Contact submit error:", err);
      setContactError("Network error. Please try again.");
    } finally {
      setContactLoading(false);
    }
  };

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
    <div className="flex flex-col min-h-screen bg-cream text-black" style={{ fontFamily: "var(--font-family)" }}>
      {/* Header */}
      <header className="bg-black text-cream shadow-md">
        <nav className="flex justify-between items-center h-20 px-8">
          {/* Logo */}
          <div className="pl-2">
            <Link href={localStorage.getItem("token") ? "/dashboard" : "/"}>
              <img
                src="/B_2.png"
                alt="BetaNest Logo"
                className="h-10 w-auto"
                style={{ display: "inline-block", width: "164px", height: "18px" }}
              />
            </Link>
          </div>

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
      <footer className="bg-black text-white py-10 px-6 md:px-16 mt-2">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
          {/* Contact Section */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Contact Us</h3>
            <form className="flex flex-col gap-3 mb-4" onSubmit={handleContactSubmit}>
              <input
                type="text"
                placeholder="Your Name"
                className="p-2 rounded bg-gray-800 text-white border border-gray-700"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
              />
              <input
                type="email"
                placeholder="Your Email"
                className="p-2 rounded bg-gray-800 text-white border border-gray-700"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
              <textarea
                placeholder="Your Message"
                rows="3"
                className="p-2 rounded bg-gray-800 text-white border border-gray-700"
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
              ></textarea>
              <button
                type="submit"
                className="block px-4 py-2 text-black text-sm hover:bg-cream font-semibold py-2 rounded"
                style={{ backgroundColor: "var(--color-taupe)" }}
                disabled={contactLoading}
              >
                {contactLoading ? "Sending..." : "Send Message"}
              </button>
            </form>

            {contactResponse && (
              <p className="my-2 text-sm text-green-400">{contactResponse}</p>
            )}
            {contactError && (
              <p className="my-2 text-sm text-red-400">{contactError}</p>
            )}

            <p className="text-sm text-gray-400">
              <strong>Email: <span>{" "}</span></strong> 
                <a href="mailto:info@betanestfin.com" className="text-link" style={{cursor: 'pointer'}}>
                info@betanestfin.com
              </a>
              <br />

              <strong>Address:</strong> Gujarat, India
            </p>
          </div>

          {/* Compliance Section */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Compliance & Trust</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              AMFI Registration Number: <strong>ARN-188188 (CHANDRA K GANGANI)</strong><br />
              ARN Number Valid Till: <strong>11th Oct, 2027</strong><br /><br />
              Mutual Fund investments are subject to market risks. Please read all scheme-related documents carefully before investing. We are an AMFI-registered mutual fund distributor under ARN-188188. We do not provide portfolio management or stock advisory services, nor do we offer any other paid services.
            </p>
          </div>

          {/* Social & Legal */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Connect</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>
                <Link href="https://betanestfinance.medium.com" target="_blank" className="hover:text-white">
                  Medium
                </Link>
              </li>
            </ul>

            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">Legal</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>
                  <Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white">Terms & Conditions</Link>
                </li>
                <li>
                  <Link href="/faqs" className="hover:text-white">FAQs</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center text-gray-500 text-sm mt-10 border-t border-gray-700 pt-4">
          © {new Date().getFullYear()} BetaNest. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
