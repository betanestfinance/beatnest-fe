"use client";
import Head from "next/head";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    if (!/\S+@\S+\.\S+/.test(value)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/apiv1/users/reset-password/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) setMessage(data.message);
      else setError(data.message || "Something went wrong");
    } catch {
      setError("Server error, please try again later");
    }
  };

  return (
    <>
    <Head>
        <title>Forgot Password</title>
        <description>BetaNest Home</description>
    </Head>
    <div className="flex flex-col justify-center items-center bg-cream px-4" style={{ height: "calc(100vh - 160px)", fontFamily: "var(--font-family)" }}>
      {/* Heading Section */}
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold text-black">Forgot Password</h1>
        <p className="text-warm-gray mt-1">Enter your registered email to receive a password reset link.</p>
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

        {/* Submit Button */}
        <button type="submit" className="btn-black">
          Send Reset Link
        </button>
      </form>
      <div className="mb-4">
        {message && <p className="text-green-600 mt-4">{message}</p>}
        {error && <p className="text-red-600 mt-4">{error}</p>}
      </div>
    </div>
    </>
  );
}
