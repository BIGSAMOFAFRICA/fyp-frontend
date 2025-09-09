import { useState } from "react";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export default function RequestPasswordReset() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");

  const handleRequest = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/auth/request-password-reset", { email });
      toast.success("If that email exists, an OTP was sent.");
      setStep(2);
    } catch {
      toast.error("Something went wrong.");
    }
    setLoading(false);
  };

  const handleReset = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/auth/reset-password", { email, otp, password });
      toast.success("Password reset! You can now log in.");
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid or expired OTP.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-gray-800 p-8 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-emerald-400 mb-4">Reset Password</h2>
      {step === 1 && (
        <form onSubmit={handleRequest} className="space-y-4">
          <input
            type="email"
            className="w-full p-2 rounded bg-gray-700 text-white"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>
      )}
      {step === 2 && (
        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="text"
            className="w-full p-2 rounded bg-gray-700 text-white"
            placeholder="Enter OTP"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            required
          />
          <input
            type="password"
            className="w-full p-2 rounded bg-gray-700 text-white"
            placeholder="New password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      )}
      {step === 3 && (
        <div className="text-center text-emerald-400 font-semibold">
          Password reset successful!{" "}
          <a href="/login" className="underline text-emerald-300">
            Login
          </a>
        </div>
      )}
    </div>
  );
}
