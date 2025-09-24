


import { useEffect, useState } from "react";
import axios from "../lib/axios";
import CreateProductForm from "../components/CreateProductForm";
import MyProductsList from "../components/MyProductsList";

const SellerDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [active, setActive] = useState("upload"); // upload | products | orders | earnings

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
  }, []);

  // Withdraw logic placeholder (no wallet balance in grouped data)
  // Withdraw placeholder removed (not used)

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;
  if (!analytics) return null;

  // (safeNum removed, not needed)


  const { analytics: counts, totalRevenue, recentTransactions } = analytics;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Seller Dashboard</h1>

      <div className="flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-56 flex-shrink-0">
          <nav className="bg-white rounded border border-gray-300 p-3">
            <ul className="space-y-2">
              <li>
                <button onClick={() => setActive("upload")} className={`w-full text-left px-3 py-2 rounded ${active === "upload" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}>
                  Upload Product
                </button>
              </li>
              <li>
                <button onClick={() => setActive("products")} className={`w-full text-left px-3 py-2 rounded ${active === "products" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}>
                  My Products
                </button>
              </li>
              <li>
                <button onClick={() => setActive("orders")} className={`w-full text-left px-3 py-2 rounded ${active === "orders" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}>
                  Orders
                </button>
              </li>
              <li>
                <button onClick={() => setActive("earnings")} className={`w-full text-left px-3 py-2 rounded ${active === "earnings" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}>
                  Earnings
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        <main className="flex-1">
          {active === "upload" && (
            <div className="bg-white rounded border border-gray-300 p-4">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">Create Product</h2>
              <CreateProductForm onProductCreated={fetchAnalytics} />
            </div>
          )}

          {active === "products" && (
            <div className="bg-white rounded border border-gray-300 p-4">
              <MyProductsList />
            </div>
          )}

          {active === "orders" && (
            <div className="bg-white rounded border border-gray-300 p-4">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">Orders</h2>
              {recentTransactions && recentTransactions.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-300">
                        <th className="text-left py-2 px-2 text-gray-900">Product Name</th>
                        <th className="text-left py-2 px-2 text-gray-900">Buyer ID</th>
                        <th className="text-left py-2 px-2 text-gray-900">Status</th>
                        <th className="text-right py-2 px-2 text-gray-900">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentTransactions.map((t) => (
                        <tr key={t._id} className="border-b border-gray-300">
                          <td className="py-2 px-2 text-gray-900">{t.product?.name || 'N/A'}</td>
                          <td className="py-2 px-2 font-mono text-xs text-gray-600">{t.buyer?._id || 'N/A'}</td>
                          <td className="py-2 px-2">
                            <span className={`px-2 py-1 rounded text-xs ${
                              t.status === 'approved' ? 'bg-green-600 text-white' :
                              t.status === 'pending' ? 'bg-yellow-600 text-white' :
                              t.status === 'rejected' ? 'bg-red-600 text-white' :
                              'bg-gray-600 text-white'
                            }`}>
                              {t.status || 'Unknown'}
                            </span>
                          </td>
                          <td className="py-2 px-2 text-right text-gray-900">₦{Number(t.amount || 0).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : <div className="text-gray-600 text-sm">No orders yet</div>}
            </div>
          )}

          {active === "earnings" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded border border-gray-300 p-4 text-center">
                  <div className="text-gray-600 text-sm">Pending</div>
                  <div className="text-xl font-bold text-gray-900">{counts?.pending ?? 0}</div>
                </div>
                <div className="bg-white rounded border border-gray-300 p-4 text-center">
                  <div className="text-gray-600 text-sm">Approved</div>
                  <div className="text-xl font-bold text-gray-900">{counts?.approved ?? 0}</div>
                </div>
                <div className="bg-white rounded border border-gray-300 p-4 text-center">
                  <div className="text-gray-600 text-sm">Rejected</div>
                  <div className="text-xl font-bold text-gray-900">{counts?.rejected ?? 0}</div>
                </div>
                <div className="bg-white rounded border border-gray-300 p-4 text-center">
                  <div className="text-gray-600 text-sm">Revenue</div>
                  <div className="text-xl font-bold text-gray-900">₦{Number(totalRevenue || 0).toLocaleString()}</div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );

// (ProductUploadForm removed, now using shared CreateProductForm)
};

export default SellerDashboard;
