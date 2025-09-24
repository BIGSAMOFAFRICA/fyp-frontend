import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "../lib/axios";

export default function RequestPasswordReset() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");

  const handleRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    
    try {
      await axios.post("/auth/request-password-reset", { email });
      setMessage("Reset link sent to your email");
      setStep(2);
    } catch (err) {
      setError("Invalid email");
    }
    setLoading(false);
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    
    try {
      await axios.post("/auth/reset-password", { email, otp, password });
      setMessage("Password reset! You can now log in.");
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired OTP");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white p-8 rounded-lg border border-gray-200">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Reset Password</h2>
          </div>

          {step === 1 && (
            <form onSubmit={handleRequest} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>

              {message && (
                <div className="text-center text-green-600 text-sm">
                  {message}
                </div>
              )}

              {error && (
                <div className="text-center text-red-600 text-sm">
                  {error}
                </div>
              )}
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleReset} className="space-y-6">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                  OTP Code
                </label>
                <input
                  id="otp"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  id="password"
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium"
                disabled={loading}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>

              {message && (
                <div className="text-center text-green-600 text-sm">
                  {message}
                </div>
              )}

              {error && (
                <div className="text-center text-red-600 text-sm">
                  {error}
                </div>
              )}
            </form>
          )}

          {step === 3 && (
            <div className="text-center space-y-4">
              <div className="text-green-600 font-medium">
                Password reset successful!
              </div>
              <Link
                to="/login"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium"
              >
                Go to Login
              </Link>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}