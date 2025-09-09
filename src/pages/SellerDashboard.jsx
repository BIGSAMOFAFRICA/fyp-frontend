


import { useEffect, useState } from "react";
import axios from "../lib/axios";
import CreateProductForm from "../components/CreateProductForm";

const SellerDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get("/seller/analytics", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnalytics(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAnalytics();
    // Optionally, add a websocket or polling for live updates
  }, []);

  // Withdraw logic placeholder (no wallet balance in grouped data)
  const handleWithdraw = async () => {
    // Withdraw logic placeholder (no wallet balance in grouped data)
    // No-op
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;
  if (!analytics) return null;

  // (safeNum removed, not needed)


  const { analytics: counts, totalRevenue, pendingProducts, approvedProducts, rejectedProducts, recentTransactions } = analytics;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-emerald-600 mb-8 text-center">Seller Dashboard</h1>
      <div className="mb-8 grid grid-cols-4 gap-4">
        <div className="bg-white rounded shadow p-5 flex flex-col items-center">
          <span className="text-gray-500 text-sm">Pending</span>
          <span className="text-2xl font-bold text-yellow-500">{counts?.pending ?? 0}</span>
        </div>
        <div className="bg-white rounded shadow p-5 flex flex-col items-center">
          <span className="text-gray-500 text-sm">Approved</span>
          <span className="text-2xl font-bold text-emerald-600">{counts?.approved ?? 0}</span>
        </div>
        <div className="bg-white rounded shadow p-5 flex flex-col items-center">
          <span className="text-gray-500 text-sm">Rejected</span>
          <span className="text-2xl font-bold text-red-500">{counts?.rejected ?? 0}</span>
        </div>
        <div className="bg-white rounded shadow p-5 flex flex-col items-center">
          <span className="text-gray-500 text-sm">Revenue</span>
          <span className="text-2xl font-bold text-blue-600">₦{Number(totalRevenue || 0).toLocaleString()}</span>
        </div>
      </div>
      <CreateProductForm onProductCreated={fetchAnalytics} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-lg font-semibold text-yellow-500 mb-3">Pending Products</h2>
          {pendingProducts && pendingProducts.length ? (
            <ul>
              {pendingProducts.map((p) => (
                <li key={p._id} className="mb-2 flex justify-between items-center">
                  <span>{p.name}</span>
                  <span className="text-xs text-gray-400">{p.category}</span>
                </li>
              ))}
            </ul>
          ) : <div className="text-gray-400">No pending products</div>}
        </div>
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-lg font-semibold text-emerald-600 mb-3">Approved Products</h2>
          {approvedProducts && approvedProducts.length ? (
            <ul>
              {approvedProducts.map((p) => (
                <li key={p._id} className="mb-2 flex justify-between items-center">
                  <span>{p.name}</span>
                  <span className="text-xs text-gray-400">{p.category}</span>
                </li>
              ))}
            </ul>
          ) : <div className="text-gray-400">No approved products</div>}
        </div>
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-lg font-semibold text-red-500 mb-3">Rejected Products</h2>
          {rejectedProducts && rejectedProducts.length ? (
            <ul>
              {rejectedProducts.map((p) => (
                <li key={p._id} className="mb-2 flex justify-between items-center">
                  <span>{p.name}</span>
                  <span className="text-xs text-gray-400">{p.category}</span>
                </li>
              ))}
            </ul>
          ) : <div className="text-gray-400">No rejected products</div>}
        </div>
      </div>
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        {recentTransactions && recentTransactions.length ? (
          <ul className="divide-y divide-gray-200">
            {recentTransactions.map((t) => (
              <li key={t._id} className="py-2 flex justify-between items-center">
                <span>
                  <span className="font-medium">{t.product?.name}</span> sold to <span className="font-medium">{t.buyer?.name}</span>
                </span>
                <span className="text-blue-600 font-bold">₦{Number(t.amount || 0).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        ) : <div className="text-gray-400">No revenue yet</div>}
      </div>
    </div>
  );

// (ProductUploadForm removed, now using shared CreateProductForm)
};

export default SellerDashboard;
