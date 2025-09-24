import { useCartStore } from "../stores/useCartStore";
import { useUserStore } from "../stores/useUserStore";
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";
import { useState } from "react";

const OrderSummary = () => {
  const { total, subtotal, cart } = useCartStore();
  const { user } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formattedTotal = total.toFixed(2);

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
      const payload = {
        products: cart,
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
    <div className='space-y-4 rounded-lg border border-gray-300 bg-white p-4 sm:p-6'>
      <p className='text-xl font-semibold text-blue-600'>Order summary</p>
      <div className='space-y-4'>
        <div className='space-y-2'>
          <dl className='flex items-center justify-between gap-4'>
            <dt className='text-base font-normal text-gray-600'>Total</dt>
            <dd className='text-base font-medium text-gray-900'>₦{formattedTotal}</dd>
          </dl>
        </div>

        <button
          className='flex w-full items-center justify-center rounded bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700'
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? "Processing..." : "Proceed to Checkout"}
        </button>

        {error && <p className='text-red-500 text-sm'>{error}</p>}

        <div className='flex items-center justify-center gap-2'>
          <span className='text-sm font-normal text-gray-600'>or</span>
          <Link
            to='/'
            className='inline-flex items-center gap-2 text-sm font-medium text-blue-600 underline hover:text-blue-700 hover:no-underline'
          >
            Continue Shopping
            <MoveRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;