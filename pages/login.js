"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Head from "next/head";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value.toLowerCase());

    if (!/\S+@\S+\.\S+/.test(value)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    // if (value.length < 6) {
    //   setPasswordError("Password must be at least 6 characters");
    // } else {
    //   setPasswordError("");
    // }
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

  useEffect(() => {
    if(localStorage.getItem("token")) {
      window.location.href = "/dashboard";
    }
  },[])

  return (
    !localStorage.getItem("token") &&
    <>
    <Head>
        <title>Log in</title>
        <meta name="description" content="BetaNest Home" />
    </Head>
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
          className={`input-field ${emailError ? "input-error" : ""} h-10`}
          style={{ padding: '0 1rem', lineHeight: '2.5rem' }} // Zero vertical padding, centered text
          required
        />
        {emailError && <p className="error-text">{emailError}</p>}

        {/* Password */}
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            className={`input-field ${passwordError ? "input-error" : ""} h-10`}
            style={{ 
              padding: '0 3rem 0 1rem',
              lineHeight: '2.5rem',
              height: '2.5rem'
            }}
            required
          />
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((s) => !s)}
            className="flex items-center justify-center hover:text-gray-400 z-10" 
            style={{
              paddingBottom: '13px !important',
              position: 'absolute',
              right: '0.5rem', 
              top: '50%',
              transform: 'translateY(-50%)',
              width: '2.5rem', 
              height: '2.5rem',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#6b7280',
              margin: 0 
            }}
            title={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <svg style={{ pointerEvents: 'none' }} className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5 0-9.27-3-11-8 1.16-3.04 3.63-5.46 6.58-6.62"/>
                <path d="M1 1l22 22"/>
                <path d="M10.47 10.47A3 3 0 0 0 13.53 13.53"/>
              </svg>
            ) : (
              <svg style={{ pointerEvents: 'none' }} className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </button>
        </div>

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
    </>
  );
}