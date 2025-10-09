import { useEffect, useState } from "react";
import axios from "../lib/axios";

const AdminEscrowPage = () => {
  const [revenueData, setRevenueData] = useState({
    totalAdminRevenue: 0,
    pendingAdminRevenue: 0,
    totalMarketplaceRevenue: 0,
    totalCompletedOrders: 0,
    totalPendingOrders: 0,
    totalOrders: 0,
    awaitingConfirmation: 0
  });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchRevenueData();
    fetchTransactions();
  }, []);

  const fetchRevenueData = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get("/payments/escrow/revenue", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRevenueData(res.data);
    } catch (err) {
      console.error("Error fetching revenue data:", err);
    }
  };

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get("/payments/escrow/transactions", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(res.data.transactions || []);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (transactionId, action) => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const endpoint = action === "release" ? "escrow/release" : "escrow/cancel";
      await axios.post(`/payments/${endpoint}`, { escrowTransactionId: transactionId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      await fetchRevenueData();
      await fetchTransactions();
    } catch (err) {
      console.error(`Error ${action}ing transaction:`, err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading escrow data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Escrow & Revenue Management</h2>
            <p className="text-sm text-gray-600 mt-1">Manage escrow transactions and monitor revenue</p>
          </div>
          <button
            onClick={() => {
              fetchRevenueData();
              fetchTransactions();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh</span>
          </button>
        </div>
      </div>
        
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-500">Total Admin Revenue</div>
          <div className="text-2xl font-bold text-green-600">
            ₦{revenueData.totalAdminRevenue?.toLocaleString() || 0}
          </div>
          <div className="text-xs text-gray-400">From completed orders</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-500">Pending Admin Revenue</div>
          <div className="text-2xl font-bold text-yellow-600">
            ₦{revenueData.pendingAdminRevenue?.toLocaleString() || 0}
          </div>
          <div className="text-xs text-gray-400">In escrow</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-500">Total Marketplace Revenue</div>
          <div className="text-2xl font-bold text-blue-600">
            ₦{revenueData.totalMarketplaceRevenue?.toLocaleString() || 0}
          </div>
          <div className="text-xs text-gray-400">All completed sales</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-500">Pending Orders</div>
          <div className="text-2xl font-bold text-orange-600">
            {revenueData.totalPendingOrders || 0}
          </div>
          <div className="text-xs text-gray-400">Awaiting payment</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-500">Awaiting Confirmation</div>
          <div className="text-2xl font-bold text-purple-600">
            {revenueData.awaitingConfirmation || 0}
          </div>
          <div className="text-xs text-gray-400">Awaiting seller confirmation</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Escrow Transactions</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Buyer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Seller
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Admin Share (15%)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Seller Share (85%)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.length > 0 ? (
                transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {tx.buyerId?.name || "Unknown"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {tx.sellerId?.name || "Unknown"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {tx.productId?.name || "Unknown Product"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₦{tx.totalAmount?.toLocaleString() || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                      ₦{tx.adminShare?.toLocaleString() || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                      ₦{tx.sellerShare?.toLocaleString() || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        tx.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                        tx.status === "completed" ? "bg-blue-100 text-blue-800" :
                        tx.status === "released" ? "bg-green-100 text-green-800" :
                        tx.status === "cancelled" ? "bg-red-100 text-red-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {tx.status === "pending" ? "Pending" :
                         tx.status === "Pending" ? "Payment Confirmed" :
                         tx.status === "completed" ? "Completed" :
                         tx.status === "released" ? "Released" :
                         tx.status === "cancelled" ? "Cancelled" : "Unknown"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {tx.status === "pending" && (
                        <div className="flex space-x-2">
                          <button
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs disabled:opacity-50"
                            onClick={() => handleAction(tx._id, "release")}
                            disabled={actionLoading}
                          >
                            Release
                          </button>
                          <button
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs disabled:opacity-50"
                            onClick={() => handleAction(tx._id, "cancel")}
                            disabled={actionLoading}
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                      {tx.status === "completed" && (
                        <div className="flex space-x-2">
                          <button
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs disabled:opacity-50"
                            onClick={() => handleAction(tx._id, "release")}
                            disabled={actionLoading}
                          >
                            Release
                          </button>
                          <span className="text-blue-600 text-xs">Confirmed by Seller</span>
                        </div>
                      )}
                      {tx.status === "released" && (
                        <span className="text-green-600 text-xs">Released</span>
                      )}
                      {tx.status === "cancelled" && (
                        <span className="text-red-600 text-xs">Cancelled</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    No escrow transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminEscrowPage;