"use client";
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

  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactLoading, setContactLoading] = useState(false);
  const [contactResponse, setContactResponse] = useState(null);
  const [contactError, setContactError] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  // Nav items
  const navItems = localStorage.getItem("token")
    ? [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Investments", path: "/investments" },
        { name: "Wealth Blueprint", path: "/Wealthblueprint" },
        { name: "Articles", path: "/articles" },
      ]
    : [
        { name: "Home", path: "/" },
        { name: "About", path: "/about" },
        { name: "Wealth Blueprint", path: "/Wealthblueprint" },
        { name: "Wealth Calculators", path: "/calculators" },
        { name: "Articles", path: "/articles" },
      ];

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
      <div className="flex-1 overflow-y-auto">

        <header className={`fixed inset-x-0 top-0 z-[60] bg-black text-cream transition-shadow duration-300 ${scrolled ? "shadow-2xl" : "shadow-md"}`}>
          <nav className="relative flex justify-between items-center h-20 px-8">
            <Link 
              href={localStorage.getItem("token") ? "/dashboard" : "/"} 
              className="relative z-10 flex items-center cursor-pointer hover:scale-105 transition-transform duration-200"
              style={{ outline: 'none' }}
            >
              <img
                src="/B_2.png"
                alt="BetaNest Logo"
                className="h-auto"
                style={{ width: "164px", height: "18px", cursor: 'pointer' }}
              />
            </Link>

            {/* DESKTOP MENU */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`
                    relative inline-block pb-1 text-base font-medium
                    transition-all duration-200
                    cursor-pointer
                    hover:text-warm-gray
                    after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-taupe
                    after:transition-all after:duration-300
                    hover:after:w-full
                    ${router.pathname === item.path ? "text-taupe after:w-full" : ""}
                  `}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* DESKTOP AUTH */}
            <div className="hidden md:flex items-center gap-6">
              {!user ? (
                <Link 
                  href="/login" 
                  className="px-6 py-2 bg-taupe text-black font-semibold rounded-lg cursor-pointer hover:bg-warm-gray transition-colors"
                >
                  Login
                </Link>
              ) : (
                <div className="relative" ref={dropdownRef}>
                  <button
                    className="flex items-center gap-2 px-4 py-2 bg-taupe text-black font-semibold rounded-lg cursor-pointer hover:bg-warm-gray transition-colors"
                    onClick={() => setProfileOpen(!profileOpen)}
                  >
                    <span className="text-sm">
                      {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                    </span>
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
                      <Link
                        href="/profile"
                        className="block px-4 py-3 text-sm text-gray-800 hover:bg-cream cursor-pointer transition-colors"
                        onClick={() => setProfileOpen(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={() => { logout(); setProfileOpen(false); }}
                        className="w-full text-left px-4 py-3 text-sm text-gray-800 hover:bg-cream cursor-pointer transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* MOBILE TOGGLE */}
            <button
              className="md:hidden z-10 cursor-pointer p-2 hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={36} /> : <Menu size={36} />}
            </button>
          </nav>

          {/* MOBILE MENU */}
          {menuOpen && (
            <div className="md:hidden absolute inset-x-0 top-20 bg-black border-t border-warm-gray shadow-xl">
              <div className="px-6 py-4 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setMenuOpen(false)}
                    className={`
                      block py-3 px-4 rounded-lg text-base font-medium cursor-pointer
                      transition-colors
                      ${router.pathname === item.path
                        ? "bg-taupe text-black"
                        : "hover:bg-warm-gray hover:text-cream"
                      }
                    `}
                  >
                    {item.name}
                  </Link>
                ))}

                {!user ? (
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="block py-3 px-4 rounded-lg bg-taupe text-black font-semibold text-center cursor-pointer hover:bg-warm-gray transition-colors"
                  >
                    Login
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="block py-3 px-4 rounded-lg hover:bg-warm-gray hover:text-cream cursor-pointer transition-colors"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => { logout(); setMenuOpen(false); }}
                      className="w-full text-left py-3 px-4 rounded-lg hover:bg-warm-gray hover:text-cream cursor-pointer transition-colors"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </header>

        {/* MAIN CONTENT  */}
        <main className="flex-grow mt-20">{children}</main>

        {/* FOOTER */}
        <footer className="bg-black text-white py-10 px-6 md:px-16 mt-2">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
            {/* Contact Section */}
            <div>
              <h3 className="text-2xl font-semibold mb-3">Contact Us</h3>
              <form className="flex flex-col gap-3 mb-4" onSubmit={handleContactSubmit}>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="p-2 rounded bg-gray-800 text-white border border-gray-700 cursor-pointer"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="p-2 rounded bg-gray-800 text-white border border-gray-700 cursor-pointer"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                />
                <textarea
                  placeholder="Your Message"
                  rows="3"
                  className="p-2 rounded bg-gray-800 text-white border border-gray-700 cursor-pointer"
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                />
                <button
                  type="submit"
                  className="block px-4 py-2 text-black text-sm hover:bg-cream font-semibold py-2 rounded cursor-pointer"
                  style={{ backgroundColor: "var(--color-taupe)" }}
                  disabled={contactLoading}
                >
                  {contactLoading ? "Sending..." : "Send Message"}
                </button>
              </form>

              {contactResponse && <p className="my-2 text-sm text-green-400">{contactResponse}</p>}
              {contactError && <p className="my-2 text-sm text-red-400">{contactError}</p>}

              <p className="text-base text-gray-400">
                <strong>Email: </strong>
                <a href="mailto:info@betanestfin.com" className="text-link cursor-pointer" target="_blank">
                  info@betanestfin.com
                </a>
                <br />
                <strong>Phone: </strong>
                <a href="https://wa.me/message/DZQ3F7K7GWC7M1" className="text-link cursor-pointer" target="_blank">
                  +91-7874317101
                </a>
                <br />
                <strong>Address:</strong> Gujarat, India
              </p>
            </div>

            {/* Compliance */}
            <div>
              <h3 className="text-2xl font-semibold mb-3">Compliance & Trust</h3>
              <p className="text-base text-gray-300 leading-relaxed">
                AMFI Registration Number: <strong>ARN-188188 (CHANDRA K GANGANI)</strong><br />
                ARN Number Valid Till: <strong>11th Oct, 2027</strong><br /><br />
                Mutual Fund investments are subject to market risks. Please read all scheme-related documents carefully before investing.
              </p>
            </div>

            {/* Social & Legal */}
            <div>
              <h3 className="text-2xl font-semibold mb-3">Connect</h3>
              <ul className="text-base text-gray-300 space-y-1">
                <li>
                  <a href="https://betanestfinance.medium.com" target="_blank" className="hover:text-white cursor-pointer">
                    Medium
                  </a>
                </li>
              </ul>

              <div className="mt-6">
                <h3 className="text-2xl font-semibold mb-2">Legal</h3>
                <ul className="text-base text-gray-300 space-y-1">
                  <li><Link href="/privacy-policy" className="hover:text-white cursor-pointer">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="hover:text-white cursor-pointer">Terms & Conditions</Link></li>
                  <li><Link href="/faqs" className="hover:text-white cursor-pointer">FAQs</Link></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center text-gray-500 text-sm mt-10 border-t border-gray-700 pt-4">
            © {new Date().getFullYear()} BetaNest. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
}