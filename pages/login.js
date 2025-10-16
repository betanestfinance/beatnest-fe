"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    if (!/\S+@\S+\.\S+/.test(value)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    if (value.length < 6) {
      setPasswordError("Password must be at least 6 characters");
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (emailError || passwordError) return;

    try {
      await login(email, password);
    } catch (err) {
      setPasswordError(err.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center bg-cream px-4" style={{ height: "calc(100vh - 160px)", fontFamily: "var(--font-family)" }}>
      {/* Heading Section */}
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold text-black">Log in</h1>
        <p className="text-warm-gray mt-1">Explore your finance profile</p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="form-container w-full">
        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange}
          autoFocus
          className={`input-field ${emailError ? "input-error" : ""}`}
          required
        />
        {emailError && <p className="error-text">{emailError}</p>}

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
          className={`input-field ${passwordError ? "input-error" : ""}`}
          required
        />
        {passwordError && <p className="error-text">{passwordError}</p>}

        {/* Submit Button */}
        <button type="submit" className="btn-black">
          Login
        </button>
      </form>
      <div className="text-center mb-2 mt-2">
          <p className="text-warm-gray mt-1">Forgot password? <a href="/forgot-password" className="text-blue-600 hover:underline">Reset here</a></p>
        </div>
        <div className="text-center mb-4">
          <p className="text-warm-gray mt-1">Sign up? <a href="mailto:info@betanestfin.com" className="text-link text-blue-600 hover:underline">Contact us</a></p>
        </div>
    </div>
  );
}
