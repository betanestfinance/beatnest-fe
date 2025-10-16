"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  console.log("token",token)

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("token",token)
    if (!token) {
      setPasswordError("Invalid or missing token.");
    } else {
      setPasswordError("")
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    } else {
      setPasswordError("");
    }

    if (newPassword !== confirmPassword) {
      setConfirmError("Passwords do not match");
      return;
    } else {
      setConfirmError("");
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/apiv1/users/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newPassword,
          confirmPassword,
          token,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to reset password");

      setSuccessMessage("Password has been reset successfully!");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      setPasswordError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col justify-center items-center bg-cream px-4"
      style={{ height: "calc(100vh - 160px)", fontFamily: "var(--font-family)" }}
    >
      {/* Heading Section */}
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold text-black">Reset Password</h1>
        <p className="text-warm-gray mt-1">
          Set a new password to secure your account
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="form-container w-full">
        {/* New Password */}
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className={`input-field ${passwordError ? "input-error" : ""}`}
          required
        />
        {passwordError && <p className="error-text">{passwordError}</p>}

        {/* Confirm Password */}
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={`input-field ${confirmError ? "input-error" : ""}`}
          required
        />
        {confirmError && <p className="error-text">{confirmError}</p>}

        {/* Success Message */}
        {successMessage && (
          <p className="text-green-600 text-sm text-center mb-2">
            {successMessage}
          </p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="btn-black"
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
