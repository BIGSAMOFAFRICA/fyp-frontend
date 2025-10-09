


import { useEffect, useState } from "react";
import axios from "../lib/axios";
import CreateProductForm from "../components/CreateProductForm";
import MyProductsList from "../components/MyProductsList";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";

const SellerDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [escrowData, setEscrowData] = useState(null);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [active, setActive] = useState("upload"); 
  // Removed confirmation code logic - now only relies on buyer confirmation

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

  const fetchEscrowData = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get("/escrow-dashboard/seller/dashboard", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEscrowData(res.data);
    } catch (err) {
      console.error("Error fetching escrow data:", err);
    }
  };

  const fetchPendingOrders = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get("/payments/seller/pending-orders", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingOrders(res.data.orders || []);
    } catch (err) {
      console.error("Error fetching pending orders:", err);
    }
  };
  // Removed handleConfirmOrder function - no longer needed with buyer-only confirmation

  useEffect(() => {
    fetchAnalytics();
    fetchEscrowData();
    fetchPendingOrders();
    
    const interval = setInterval(() => {
      fetchEscrowData();
      fetchPendingOrders();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (active === "escrow") {
      fetchEscrowData();
    } else if (active === "confirm") {
      fetchPendingOrders();
    }
  }, [active]);

  
  

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;
  if (!analytics) return null;

  


  const { analytics: counts, totalRevenue } = analytics || {};

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
              <li>
                <button onClick={() => setActive("escrow")} className={`w-full text-left px-3 py-2 rounded ${active === "escrow" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}>
                  Escrow
                </button>
              </li>
              <li>
                <button onClick={() => setActive("confirm")} className={`w-full text-left px-3 py-2 rounded ${active === "confirm" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}>
                  Confirm Orders
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
              <h2 className="text-lg font-semibold mb-4 text-gray-900">Recent Orders</h2>
              {escrowData?.transactions && escrowData.transactions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-300">
                        <th className="text-left py-2 px-2 text-gray-900">Product Name</th>
                        <th className="text-left py-2 px-2 text-gray-900">Buyer</th>
                        <th className="text-left py-2 px-2 text-gray-900">Status</th>
                        <th className="text-right py-2 px-2 text-gray-900">Amount</th>
                        <th className="text-left py-2 px-2 text-gray-900">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {escrowData.transactions.slice(0, 10).map((t) => (
                        <tr key={t._id} className="border-b border-gray-300">
                          <td className="py-2 px-2 text-gray-900">{t.productId?.name || 'N/A'}</td>
                          <td className="py-2 px-2 text-gray-900">{t.buyerId?.name || 'N/A'}</td>
                          <td className="py-2 px-2">
                            <span className={`px-2 py-1 rounded text-xs ${
                              t.status === 'released' ? 'bg-green-600 text-white' :
                              t.status === 'pending' ? 'bg-yellow-600 text-white' :
                              t.status === 'cancelled' ? 'bg-red-600 text-white' :
                              'bg-gray-600 text-white'
                            }`}>
                              {t.status || 'Unknown'}
                            </span>
                          </td>
                          <td className="py-2 px-2 text-right text-gray-900">₦{Number(t.totalAmount || 0).toLocaleString()}</td>
                          <td className="py-2 px-2 text-gray-600 text-xs">{new Date(t.createdAt).toLocaleDateString()}</td>
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

          {active === "escrow" && (
            <div className="bg-white rounded border border-gray-300 p-4">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">Escrow Dashboard</h2>
              {escrowData ? (
                <div className="space-y-6">
                  {}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="text-sm text-green-600">Total Earnings (Released)</div>
                      <div className="text-2xl font-bold text-green-700">
                        ₦{escrowData.earnings?.totalEarnings?.toLocaleString() || 0}
                      </div>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <div className="text-sm text-yellow-600">Pending Earnings</div>
                      <div className="text-2xl font-bold text-yellow-700">
                        ₦{escrowData.earnings?.pendingEarnings?.toLocaleString() || 0}
                      </div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="text-sm text-blue-600">Total Revenue</div>
                      <div className="text-2xl font-bold text-blue-700">
                        ₦{escrowData.earnings?.totalRevenue?.toLocaleString() || 0}
                      </div>
                    </div>
                  </div>

                  {}
                  <div>
                    <h3 className="text-md font-semibold mb-3 text-gray-900">Recent Escrow Transactions</h3>
                    {escrowData.transactions && escrowData.transactions.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-300">
                              <th className="text-left py-2 px-2 text-gray-900">Product</th>
                              <th className="text-left py-2 px-2 text-gray-900">Buyer</th>
                              <th className="text-left py-2 px-2 text-gray-900">Total Amount</th>
                              <th className="text-left py-2 px-2 text-gray-900">Your Share (85%)</th>
                              <th className="text-left py-2 px-2 text-gray-900">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {escrowData.transactions.slice(0, 10).map((tx) => (
                              <tr key={tx._id} className="border-b border-gray-300">
                                <td className="py-2 px-2 text-gray-900">{tx.productId?.name || 'N/A'}</td>
                                <td className="py-2 px-2 text-gray-900">{tx.buyerId?.name || 'N/A'}</td>
                                <td className="py-2 px-2 text-gray-900">₦{tx.totalAmount?.toLocaleString() || 0}</td>
                                <td className="py-2 px-2 text-green-600 font-medium">₦{tx.sellerShare?.toLocaleString() || 0}</td>
                                <td className="py-2 px-2">
                                  <span className={`px-2 py-1 rounded text-xs ${
                                    tx.status === 'released' ? 'bg-green-100 text-green-800' :
                                    tx.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                    tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {tx.status === 'pending' ? 'Pending' :
                                     tx.status === 'Pending' ? 'Payment Confirmed' :
                                     tx.status === 'completed' ? 'Confirmed' :
                                     tx.status === 'released' ? 'Released' :
                                     tx.status === 'cancelled' ? 'Cancelled' : 'Unknown'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-gray-600 text-sm">No escrow transactions yet</div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-gray-600">Loading escrow data...</div>
              )}
            </div>
          )}

          {active === "confirm" && (
            <div className="bg-white rounded border border-gray-300 p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Confirm Orders</h2>
                <button
                  onClick={() => fetchPendingOrders()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  Refresh Orders
                </button>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-blue-800 text-sm">
                  <strong>How it works:</strong> Buyers will confirm if they received the product using simple &quot;Product Received&quot; or &quot;Product Not Received&quot; buttons. 
                  Once they confirm, the admin will process your payment (85% of total amount). No codes needed!
                </p>
              </div>
              
              
              {pendingOrders.length > 0 ? (
                <div className="space-y-4">
                  {pendingOrders.map((order) => (
                    <div key={order._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{order.productId?.name}</h3>
                          <p className="text-sm text-gray-600">Buyer: {order.buyerId?.name}</p>
                          <p className="text-sm text-gray-600">Amount: ₦{order.totalAmount?.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">Your Share: ₦{order.sellerShare?.toLocaleString()}</p>
                          {/* Buyer Confirmation Status */}
                          {order.buyerConfirmation ? (
                            <div className={`mt-2 p-2 border rounded ${
                              order.buyerConfirmation === 'received' 
                                ? 'bg-green-50 border-green-200' 
                                : 'bg-red-50 border-red-200'
                            }`}>
                              <div className="flex items-center">
                                {order.buyerConfirmation === 'received' ? (
                                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                                ) : (
                                  <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
                                )}
                                <span className={`text-sm font-medium ${
                                  order.buyerConfirmation === 'received' ? 'text-green-800' : 'text-red-800'
                                }`}>
                                  Buyer {order.buyerConfirmation === 'received' ? 'confirmed: Product Received' : 'reported: Product Not Received'}
                                </span>
                              </div>
                              {order.buyerConfirmationNote && (
                                <p className={`text-xs mt-1 ${
                                  order.buyerConfirmation === 'received' ? 'text-green-700' : 'text-red-700'
                                }`}>
                                  Note: {order.buyerConfirmationNote}
                                </p>
                              )}
                              <p className={`text-xs mt-1 ${
                                order.buyerConfirmation === 'received' ? 'text-green-600' : 'text-red-600'
                              }`}>
                                Confirmed: {new Date(order.buyerConfirmedAt).toLocaleString()}
                              </p>
                            </div>
                          ) : (
                            <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                              <p className="text-xs text-blue-800 font-medium">Waiting for buyer confirmation...</p>
                              <p className="text-xs text-blue-600 mt-1">
                                The buyer needs to confirm if they received the product
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                            <Clock className="w-3 h-3 mr-1" />
                            Awaiting Confirmation
                          </span>
                          {/* Removed expiry information - no longer relevant with buyer-only confirmation */}
                        </div>
                      </div>
                      
                      {/* Show success message when buyer confirmed product received */}
                      {order.buyerConfirmation === 'received' && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center text-green-800">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            <span className="font-medium">Buyer confirmed product received</span>
                          </div>
                          <p className="text-sm text-green-700 mt-1">
                            The admin will now process your payment. You should receive your share (85%) shortly.
                          </p>
                        </div>
                      )}
                      
                      {/* Show message if buyer reported product not received */}
                      {order.buyerConfirmation === 'not_received' && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-center text-red-800">
                            <AlertCircle className="w-4 h-4 mr-2" />
                            <span className="font-medium">Buyer reported product not received</span>
                          </div>
                          <p className="text-sm text-red-700 mt-1">
                            Please contact the buyer to resolve this issue. The admin will investigate.
                          </p>
                        </div>
                      )}
                      
                      {/* Show waiting message if no buyer confirmation yet */}
                      {!order.buyerConfirmation && (
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex items-center text-yellow-800">
                            <Clock className="w-4 h-4 mr-2" />
                            <span className="font-medium">Waiting for buyer confirmation</span>
                          </div>
                          <p className="text-sm text-yellow-700 mt-1">
                            The buyer needs to confirm if they received the product before you can proceed.
                          </p>
                        </div>
                      )}
                      
                      {/* Removed confirmation error display - no longer needed */}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                  <p className="text-gray-600">No pending orders to confirm</p>
                  <p className="text-sm text-gray-500">All your orders have been confirmed or completed</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );


};

export default SellerDashboard;
