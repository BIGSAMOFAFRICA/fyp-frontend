import { motion } from "framer-motion";
import { useCartStore } from "../stores/useCartStore";
import { useUserStore } from "../stores/useUserStore";
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";
import { useState } from "react";

const OrderSummary = () => {
  const { total, subtotal, coupon, isCouponApplied, cart, applyCoupon, removeCoupon } = useCartStore();
  const { user } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState(null);
  let appliedDiscount = 0;
  let appliedCouponCode = null;
  let displayTotal = total;
  let displaySavings = subtotal - total;

  if (coupon && isCouponApplied) {
    appliedDiscount = coupon.discountPercentage;
    appliedCouponCode = coupon.code;
    displayTotal = subtotal - (subtotal * (appliedDiscount / 100));
    displaySavings = subtotal - displayTotal;
  }

  // Local coupon logic for BIGSAMOFAFRICA
  if (couponInput.trim().toUpperCase() === "BIGSAMOFAFRICA" && !isCouponApplied) {
    appliedDiscount = 20;
    appliedCouponCode = "BIGSAMOFAFRICA";
    displayTotal = subtotal * 0.8;
    displaySavings = subtotal - displayTotal;
  }

  const formattedSubtotal = subtotal.toFixed(2);
  const formattedTotal = displayTotal.toFixed(2);
  const formattedSavings = displaySavings.toFixed(2);

  const handlePayment = async () => {
    if (!user?.email) {
      setError("You must be logged in to checkout.");
      setLoading(false);
      return;
    }
    if (!cart || cart.length === 0) {
      setError("Your cart is empty");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let couponCode = null;
      if (appliedCouponCode) couponCode = appliedCouponCode;
      const payload = {
        products: cart,
        couponCode,
        email: user.email,
      };
      console.log("Sending payment request with payload:", payload);

      // Use the correct backend URL for payment initialization (matches backend route)
      const apiBase = import.meta.env.VITE_API_URL || 'https://fyp-backend-9t8k.onrender.com/api';
      const backendUrl = `${apiBase}/payments/create-checkout-session`;
      const response = await import("../lib/axios").then(m =>
        m.default.post(backendUrl, payload)
      );
      const { url, success_url, cancel_url } = response.data;
      if (url) {
        // Store success/cancel URLs in sessionStorage for later use if needed
        if (success_url) sessionStorage.setItem("payment_success_url", success_url);
        if (cancel_url) sessionStorage.setItem("payment_cancel_url", cancel_url);
        window.location.href = url;
      } else {
        setError("Payment initialization failed: No redirect URL returned.");
        setLoading(false);
      }
    } catch (error) {
      let message = "Payment failed. Please try again.";
      if (error.response && error.response.data && error.response.data.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }
      setError(message);
      setLoading(false);
    }
  };

  return (
    <motion.div
      className='space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <p className='text-xl font-semibold text-emerald-400'>Order summary</p>
      <div className='space-y-4'>
        <div className='space-y-2'>
          <dl className='flex items-center justify-between gap-4'>
            <dt className='text-base font-normal text-gray-300'>Original price</dt>
            <dd className='text-base font-medium text-white'>₦{formattedSubtotal}</dd>
          </dl>
          {displaySavings > 0 && (
            <dl className='flex items-center justify-between gap-4'>
              <dt className='text-base font-normal text-gray-300'>Savings</dt>
              <dd className='text-base font-medium text-emerald-400'>-₦{formattedSavings}</dd>
            </dl>
          )}
          {coupon && isCouponApplied && (
            <dl className='flex items-center justify-between gap-4'>
              <dt className='text-base font-normal text-gray-300'>Coupon ({coupon.code})</dt>
            </dl>
          )}
          {appliedCouponCode && (
            <dl className='flex items-center justify-between gap-4'>
              <dt className='text-base font-normal text-gray-300'>Coupon ({appliedCouponCode})</dt>
              <dd className='text-base font-medium text-emerald-400'>-{appliedDiscount}%</dd>
            </dl>
          )}
          {/* Coupon input */}
          <div className='flex items-center gap-2 mb-2'>
            <input
              type='text'
              placeholder='Enter coupon code'
              value={couponInput}
              onChange={(e) => {
                setCouponInput(e.target.value);
                setCouponError(null);
              }}
              className='w-2/3 p-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400'
            />
            <button
              className='px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium'
              onClick={() => {
                if (couponInput.trim().toUpperCase() === "BIGSAMOFAFRICA") {
                  setCouponError(null);
                  // No backend call needed for this coupon, discount is handled locally
                } else {
                  applyCoupon(couponInput.trim());
                }
              }}
              type='button'
            >
              Apply
            </button>
            <button
              className='px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm font-medium'
              onClick={() => {
                setCouponInput("");
                setCouponError(null);
                removeCoupon();
              }}
              type='button'
            >
              Remove
            </button>
          </div>
          {couponError && <p className='text-red-500 text-xs'>{couponError}</p>}
        </div>

        <motion.button
          className='flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300'
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? "Processing..." : "Proceed to Checkout"}
        </motion.button>

        {error && <p className='text-red-500 text-sm'>{error}</p>}

        <div className='flex items-center justify-center gap-2'>
          <span className='text-sm font-normal text-gray-400'>or</span>
          <Link
            to='/'
            className='inline-flex items-center gap-2 text-sm font-medium text-emerald-400 underline hover:text-emerald-300 hover:no-underline'
          >
            Continue Shopping
            <MoveRight size={16} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderSummary;
// ...existing code up to the first export default OrderSummary;