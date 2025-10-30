

import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import SellerDashboard from "./pages/SellerDashboard";
import BuyerDashboard from "./pages/BuyerDashboard";
import CategoryPage from "./pages/CategoryPage";
import AddProductPage from "./pages/AddProductPage";
// VerifyEmail component removed — signup no longer requires email OTP
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import { useUserStore } from "./stores/useUserStore";
import { useEffect } from "react";
import LoadingSpinner from "./components/LoadingSpinner";
import CartPage from "./pages/CartPage";
import { useCartStore } from "./stores/useCartStore";
import PurchaseCancelPage from "./pages/PurchaseCancelPage";
import PurchaseSuccessPage from "./pages/PurchaseSuccessPage";
import OrderCompletedPage from "./pages/OrderCompletedPage";
import RequestPasswordReset from "./pages/RequestPasswordReset";
import ResetPassword from "./pages/ResetPassword";
import TransactionCheckPage from "./pages/TransactionCheckPage";

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
    <div className="min-h-screen bg-white text-gray-900">
      <div className="pt-16 max-w-6xl mx-auto px-4">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={!user ? <SignUpPage /> : <Navigate to="/" />} />
          {/* /verify-email route removed — not used anymore */}
          <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
          {}
          <Route path="/admin/dashboard" element={user && isAdmin() ? <AdminPage /> : <Navigate to="/login" />} />
          {}
          <Route path="/seller/dashboard" element={user && role === "seller" ? <SellerDashboard sellerId={user?._id} /> : <Navigate to="/login" />} />
          {}
          <Route path="/buyer/dashboard" element={user && role === "buyer" ? <BuyerDashboard buyerId={user?._id} /> : <Navigate to="/login" />} />
          <Route path="/add-product" element={user && role === "seller" ? <AddProductPage /> : <Navigate to="/login" />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/cart" element={user ? <CartPage /> : <Navigate to="/login" />} />
          <Route path="/purchase-success" element={<PurchaseSuccessPage />} />
          <Route path="/order-completed" element={<OrderCompletedPage />} />
          <Route path="/purchase-cancel" element={<PurchaseCancelPage />} />
          <Route path="/check-transaction/:reference" element={<TransactionCheckPage />} />
          <Route path="/forgot-password" element={<RequestPasswordReset />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </div>
      <Toaster />
    </div>
  );
};

export default App;