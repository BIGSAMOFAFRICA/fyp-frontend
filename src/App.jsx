// File: frontend/src/App.jsx
// Instructions: Replace the existing `App.jsx` in `frontend/src/` with this content.

import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import SellerDashboard from "./pages/SellerDashboard";
import BuyerDashboard from "./pages/BuyerDashboard";
import CategoryPage from "./pages/CategoryPage";
import AddProductPage from "./pages/AddProductPage";
import VerifyEmail from "./components/VerifyEmail";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import { useUserStore } from "./stores/useUserStore";
import { useEffect } from "react";
import LoadingSpinner from "./components/LoadingSpinner";
import CartPage from "./pages/CartPage";
import { useCartStore } from "./stores/useCartStore";
import PurchaseCancelPage from "./pages/PurchaseCancelPage";
import PurchaseSuccess from "./pages/PurchaseSuccess";
import RequestPasswordReset from "./pages/RequestPasswordReset";
import ResetPassword from "./pages/ResetPassword";

const App = () => {
  const { user, checkAuth, checkingAuth, role, isAdmin } = useUserStore();
  const { getCartItems } = useCartStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!user) return;
    getCartItems();
  }, [getCartItems, user]);

  if (checkingAuth) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]" />
        </div>
      </div>

      <div className="relative z-50 pt-20">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={!user ? <SignUpPage /> : <Navigate to="/" />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
          {/* Admin dashboard (legacy) */}
          <Route path="/admin/dashboard" element={user && isAdmin() ? <AdminPage /> : <Navigate to="/login" />} />
          {/* Admin escrow dashboard removed: admins do not have escrow pages */}
          {/* Seller dashboard */}
          <Route path="/seller/dashboard" element={user && role === "seller" ? <SellerDashboard sellerId={user?._id} /> : <Navigate to="/login" />} />
          {/* Buyer dashboard */}
          <Route path="/buyer/dashboard" element={user && role === "buyer" ? <BuyerDashboard buyerId={user?._id} /> : <Navigate to="/login" />} />
          <Route path="/add-product" element={user && role === "seller" ? <AddProductPage /> : <Navigate to="/login" />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/cart" element={user ? <CartPage /> : <Navigate to="/login" />} />
          <Route path="/purchase-success" element={<PurchaseSuccess />} />
          <Route path="/purchase-cancel" element={user ? <PurchaseCancelPage /> : <Navigate to="/login" />} />
          <Route path="/forgot-password" element={<RequestPasswordReset />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </div>
      <Toaster />
    </div>
  );
};

export default App;