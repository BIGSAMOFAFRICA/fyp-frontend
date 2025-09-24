import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, Mail, Lock, User, ArrowRight, Loader } from "lucide-react";
import { useUserStore } from "../stores/useUserStore.js";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "buyer",
  });

  const [passwordError, setPasswordError] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);

  const { signup, loading, user, role, isAdmin } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.isVerified) {
      if (isAdmin()) navigate("/admin/dashboard", { replace: true });
      else if (role === "seller") navigate("/seller/dashboard", { replace: true });
      else if (role === "buyer") navigate("/buyer/dashboard", { replace: true });
      else navigate("/", { replace: true });
    }
  }, [user, role, isAdmin, navigate]);

  // Strong password validation
  const validatePassword = (password) => {
    const errors = [];
    
    if (password.length < 8) {
      errors.push("at least 8 characters long");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("one lowercase letter");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("one uppercase letter");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("one number");
    }
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
      errors.push("one special character");
    }
    
    if (errors.length > 0) {
      return `Password must contain ${errors.join(", ")}.`;
    }
    
    return "";
  };

  // Check if password is valid
  const isPasswordValid = () => {
    return validatePassword(formData.password) === "";
  };

  // Check if passwords match
  const doPasswordsMatch = () => {
    return formData.password === formData.confirmPassword;
  };

  // Check if form is valid for submission
  const isFormValid = () => {
    return formData.name.trim() !== "" && 
           formData.email.trim() !== "" && 
           isPasswordValid() && 
           doPasswordsMatch() && 
           formData.role !== "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData, navigate);
  };

  return (
    <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold text-blue-600">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 border border-gray-300 rounded sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full name
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="block w-full px-3 py-2 pl-10 bg-white border border-gray-300 rounded placeholder-gray-400 focus:outline-none focus:border-blue-500 sm:text-sm"
                  placeholder="Olabisi Samuel"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="block w-full px-3 py-2 pl-10 bg-white border border-gray-300 rounded placeholder-gray-400 focus:outline-none focus:border-blue-500 sm:text-sm"
                  placeholder="sam@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    setPasswordTouched(true);
                    setPasswordError(validatePassword(e.target.value));
                  }}
                  className={`block w-full px-3 py-2 pl-10 bg-white border rounded placeholder-gray-400 focus:outline-none sm:text-sm ${
                    passwordTouched && passwordError ? "border-red-300 focus:border-red-500" : "border-gray-300 focus:border-blue-500"
                  }`}
                  placeholder="••••••••"
                />
              </div>

              {/* Password error message */}
              {passwordTouched && passwordError && (
                <p className="mt-1 text-sm text-red-600">{passwordError}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className={`block w-full px-3 py-2 pl-10 bg-white border rounded placeholder-gray-400 focus:outline-none sm:text-sm ${
                    formData.confirmPassword && !doPasswordsMatch() ? "border-red-300 focus:border-red-500" : "border-gray-300 focus:border-blue-500"
                  }`}
                  placeholder="••••••••"
                />
              </div>
              
              {/* Password match error */}
              {formData.confirmPassword && !doPasswordsMatch() && (
                <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
              )}
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Sign up as
              </label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-900 focus:outline-none focus:border-blue-500 sm:text-sm"
              >
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || !isFormValid()}
            >
              {loading ? (
                <>
                  <Loader className="mr-2 h-5 w-5" aria-hidden="true" />
                  Loading...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-5 w-5" aria-hidden="true" />
                  Sign up
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700">
              Login here <ArrowRight className="inline h-4 w-4" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
