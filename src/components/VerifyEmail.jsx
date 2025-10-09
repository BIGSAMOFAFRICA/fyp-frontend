


import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Mail, Loader, Send } from "lucide-react";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialEmail = location.state?.email || "";
  const [formData, setFormData] = useState({ email: initialEmail, code: "" });
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/auth/verify-otp", {
        email: formData.email,
        code: formData.code,
      });
      toast.success(res.data.message);
      setSuccess(true);
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 2000);
    } catch (error) {
      const message = error.response?.data?.message || "Verification failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  
  const handleResend = async () => {
    setResendLoading(true);
    try {
      const res = await axios.post("/auth/send-otp", {
        email: formData.email,
      });
      toast.success(res.data.message);
    } catch (error) {
      const message = error.response?.data?.message || "Failed to resend OTP";
      toast.error(message);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {success && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-gray-900 p-8 rounded-lg shadow-lg flex flex-col items-center">
            <span className="text-emerald-400 text-3xl mb-2">✔</span>
            <h3 className="text-xl font-bold mb-2">Verification successful!</h3>
            <p className="text-gray-300">Redirecting to homepage...</p>
          </div>
        </div>
      )}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-emerald-400">
          Verify Your Email
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Enter the 6-digit OTP sent to your email
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-300">
                OTP Code
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="code"
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  placeholder="Enter 6-digit OTP"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500  disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader className="mr-2 h-5 w-5 " aria-hidden="true" />
                  Verifying...
                </>
              ) : (
                "Verify Email"
              )}
            </button>
          </form>

          <button
            onClick={handleResend}
            className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500  disabled:opacity-50"
            disabled={resendLoading || !formData.email}
          >
            {resendLoading ? (
              <>
                <Loader className="mr-2 h-5 w-5 " aria-hidden="true" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" aria-hidden="true" />
                Resend OTP
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;