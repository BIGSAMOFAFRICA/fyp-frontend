import { useEffect, useState } from "react";
import axios from "../lib/axios";

const BuyerDashboard = ({ buyerId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
  const res = await axios.get(`/escrow/buyer/dashboard/${buyerId}`);
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [buyerId]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-emerald-600 mb-8 text-center">Buyer Dashboard</h1>
      <div className="bg-white rounded shadow p-5 mb-8">
        <span className="text-gray-500 text-sm">Wallet Balance</span>
        <span className="text-2xl font-bold text-blue-600">₦{data.walletBalance}</span>
      </div>
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-lg font-semibold text-emerald-600 mb-3">Transactions</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Seller</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {data.transactions.length ? (
              data.transactions.map((tx) => (
                <tr key={tx._id}>
                  <td className="px-4 py-2">{tx.sellerId?.name}</td>
                  <td className="px-4 py-2">{tx.productId?.name}</td>
                  <td className="px-4 py-2">₦{tx.amount}</td>
                  <td className="px-4 py-2">{tx.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center text-gray-400 py-6">No transactions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BuyerDashboard;
