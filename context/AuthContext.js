import { createContext, useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";

const AuthContext = createContext();
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const firstName = localStorage.getItem("firstName");
      const lastName = localStorage.getItem("lastName");
      const email = localStorage.getItem("email");
      const userId = localStorage.getItem("userId");
      const dateOnBoard = localStorage.getItem("dateOnBoard");
      const riskProfile = localStorage.getItem("riskProfile");
      const riskScore = localStorage.getItem("riskScore");
      const mobile = localStorage.getItem("mobile");
      const countryCode = localStorage.getItem("countryCode");
      const age = localStorage.getItem("age");

      if (token && email && userId) {
        setUser({ id: userId, firstName, lastName, email, dateOnBoard, riskProfile, riskScore, mobile, countryCode, age});
      }
    } catch (err) {
      console.error("Error loading user from localStorage", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle login
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/apiv1/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      // Save to localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("firstName", data.user.firstName);
      localStorage.setItem("lastName", data.user.lastName);
      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("email", data.user.email);
      localStorage.setItem("dateOnBoard", data.user.dateOnBoard);
      localStorage.setItem("riskProfile", data.user.riskProfile);
      localStorage.setItem("riskScore", data.user.riskScore);
      localStorage.setItem("mobile", data.user.mobile);
      localStorage.setItem("countryCode", data.user.countryCode);
      localStorage.setItem("age", data.user.age);

      setUser(data.user);
      router.push("/dashboard");
    } catch (err) {
      throw err;
    }
  };

  // Handle logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
    localStorage.removeItem("dateOnBoard");
    localStorage.removeItem("riskProfile");
    localStorage.removeItem("riskScore");
    localStorage.removeItem("mobile");
    localStorage.removeItem("countryCode");
    localStorage.removeItem("age");
    setUser(null);
    router.push("/");
  };

  // Prevent layout flicker while checking auth state
  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
