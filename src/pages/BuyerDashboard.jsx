import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../lib/axios";

const BuyerDashboard = ({ buyerId }) => {
  const [data, setData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  
  const [issueForm, setIssueForm] = useState({
    title: "",
    description: "",
    category: "other",
    priority: "medium",
    relatedOrderId: ""
  });

  useEffect(() => {
    fetchDashboardData();
    fetchNotifications();
    fetchIssues();
    
    
    const interval = setInterval(() => {
      fetchDashboardData();
      fetchNotifications();
    }, 10000); // Reduced to 10 seconds for faster updates

    return () => clearInterval(interval);
  }, [buyerId]);

  // Listen for storage events to update when purchase is made
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'purchaseCompleted' || e.key === 'orderUpdated') {
        fetchDashboardData();
        fetchNotifications();
        
        // Show success notification
        if (e.key === 'purchaseCompleted') {
          // Show a temporary success message
          const successMessage = document.createElement('div');
          successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2';
          successMessage.innerHTML = `
            <span>Purchase completed! Dashboard updated.</span>
          `;
          document.body.appendChild(successMessage);
          
          // Remove after 3 seconds
          setTimeout(() => {
            if (successMessage.parentNode) {
              successMessage.parentNode.removeChild(successMessage);
            }
          }, 3000);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const fetchDashboardData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const token = localStorage.getItem("accessToken");
      const res = await axios.get("/escrow-dashboard/buyer/dashboard", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get("/notifications", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  const fetchIssues = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get("/issues/buyer", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIssues(res.data.issues || []);
    } catch (err) {
      console.error("Error fetching issues:", err);
    }
  };

  const handleCreateIssue = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      await axios.post("/issues", issueForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setShowIssueModal(false);
      setIssueForm({
        title: "",
        description: "",
        category: "other",
        priority: "medium",
        relatedOrderId: ""
      });
      fetchIssues();
      alert("Issue reported successfully! Our support team will review it shortly.");
    } catch (err) {
      alert("Error creating issue: " + (err.response?.data?.message || err.message));
    }
  };

  const markNotificationRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.patch(`/notifications/${notificationId}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };


  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "released":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredTransactions = data?.transactions?.filter(tx => {
    const matchesStatus = filterStatus === "all" || tx.status === filterStatus;
    const matchesSearch = searchTerm === "" || 
      tx.productId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.sellerId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.paystackReference?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  }) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 rounded-full mx-auto mb-2"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 "
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Buyer Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {data?.buyer?.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => fetchDashboardData(true)}
                disabled={refreshing}
                className={`px-4 py-2 border ${refreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
                title="Refresh Dashboard"
              >
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
              <div className="px-4 py-2 border">
                Notifications
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </div>
              <button
                onClick={() => setShowIssueModal(true)}
                className="bg-blue-600 text-white px-4 py-2"
              >
                Report Issue
              </button>
            </div>
        </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border p-6">
            <div>
              <p className="text-sm text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">₦{data?.spending?.totalSpent?.toLocaleString() || 0}</p>
            </div>
          </div>

          <div className="bg-white border p-6">
            <div>
              <p className="text-sm text-gray-600">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-900">{data?.stats?.pendingTransactions || 0}</p>
            </div>
          </div>

          <div className="bg-white border p-6">
            <div>
              <p className="text-sm text-gray-600">Completed Orders</p>
              <p className="text-2xl font-bold text-gray-900">{data?.stats?.completedTransactions || 0}</p>
            </div>
          </div>

          <div className="bg-white border p-6">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{data?.stats?.totalTransactions || 0}</p>
            </div>
          </div>
        </div>

        {}
        <div className="bg-white border mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: "overview", label: "Order Overview" },
                { id: "notifications", label: "Notifications" },
                { id: "issues", label: "Support Issues" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {}
            {activeTab === "overview" && (
              <div>
                {}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search orders, products, or sellers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2">
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="border-0 bg-transparent focus:ring-0 text-sm font-medium"
                      >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="released">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <button
                      onClick={() => fetchDashboardData(true)}
                      disabled={refreshing}
                      className={`px-4 py-2 border ${refreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
                      title="Refresh Orders"
                    >
                      {refreshing ? 'Refreshing...' : 'Refresh'}
                    </button>
                  </div>
                </div>

                {}
                <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order Details
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Seller
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
            </tr>
          </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredTransactions.length > 0 ? (
                        filteredTransactions.map((tx) => (
                          <tr key={tx._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {tx.productId?.name || 'Unknown Product'}
                                </div>
                                <div className="text-sm text-gray-500 font-mono">
                                  #{tx.paystackReference}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <span className="text-sm text-gray-900">
                                  {tx.sellerId?.name || 'Unknown Seller'}
                    </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                ₦{tx.totalAmount?.toLocaleString() || 0}
                              </div>
                  </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex flex-col">
                                <div className="flex items-center">
                                  <span className={`px-2 py-1 text-xs border ${getStatusColor(tx.status)}`}>
                                    {tx.status === 'pending' ? 'Awaiting Confirmation' :
                         tx.status === 'Pending' ? 'Payment Confirmed' :
                         tx.status === 'completed' ? 'Confirmed by Buyer' :
                         tx.status === 'released' ? 'Completed' :
                         tx.status === 'cancelled' ? 'Cancelled' : 'Unknown'}
                      </span>
                                </div>
                                {/* Buyer Confirmation Status */}
                                {tx.buyerConfirmation && (
                                  <div className="mt-2 p-2 rounded-lg border text-xs">
                                    {tx.buyerConfirmation === 'received' ? (
                                      <div className="bg-green-50 border-green-200 text-green-800">
                                        <div className="flex items-center">
                                          <span className="font-medium">You confirmed: Product Received</span>
                                        </div>
                                        {tx.buyerConfirmationNote && (
                                          <div className="mt-1 text-green-700">
                                            Note: {tx.buyerConfirmationNote}
                                          </div>
                                        )}
                                      </div>
                                    ) : (
                                      <div className="bg-red-50 border-red-200 text-red-800">
                                        <div className="flex items-center">
                                          <span className="font-medium">You reported: Product Not Received</span>
                                        </div>
                                        {tx.buyerConfirmationNote && (
                                          <div className="mt-1 text-red-700">
                                            Note: {tx.buyerConfirmationNote}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center text-sm text-gray-500">
                                {new Date(tx.createdAt).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => setIssueForm(prev => ({ ...prev, relatedOrderId: tx._id }))}
                                  className="px-3 py-1 border text-blue-600"
                                  title="View Details"
                                >
                                  View
                                </button>
                                {tx.status === 'pending' && (
                                  <button
                                    onClick={() => {
                                      setIssueForm(prev => ({ ...prev, relatedOrderId: tx._id }));
                                      setShowIssueModal(true);
                                    }}
                                    className="px-3 py-1 border text-red-600"
                                    title="Report Issue"
                                  >
                                    Report
                                  </button>
                                )}
                                {tx.status === 'released' && (
                                  <button
                                    className="px-3 py-1 border text-green-600"
                                    title="Order Completed"
                                  >
                                    Completed
                                  </button>
                                )}
                              </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                          <td colSpan={6} className="px-6 py-12 text-center">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                            <p className="text-gray-500 mb-4">
                              {searchTerm || filterStatus !== "all" 
                                ? "Try adjusting your search or filter criteria."
                                : "You haven't made any purchases yet."}
                            </p>
                            {!searchTerm && filterStatus === "all" && (
                              <Link
                                to="/"
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white"
                              >
                                Start Shopping
                              </Link>
                            )}
                          </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
              </div>
            )}

            {}
            {activeTab === "notifications" && (
              <div>
                <div className="space-y-4">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification._id}
                        className={`p-4 rounded-lg border ${
                          notification.read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className={`text-sm font-medium ${notification.read ? 'text-gray-600' : 'text-gray-900'}`}>
                                {notification.type.replace('_', ' ').toUpperCase()}
                              </span>
                              {!notification.read && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 ">
                                  New
                                </span>
                              )}
                            </div>
                            <p className={`mt-1 text-sm ${notification.read ? 'text-gray-600' : 'text-gray-900'}`}>
                              {notification.message}
                            </p>
                            <div className="flex items-center mt-2 space-x-4">
                              <p className="text-xs text-gray-500 flex items-center">
                                {new Date(notification.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          {!notification.read && (
                            <button
                              onClick={() => markNotificationRead(notification._id)}
                              className="ml-4 text-blue-600 text-sm px-3 py-1 border"
                            >
                              <span>Mark as read</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
                      <p className="text-gray-500">You&apos;ll receive notifications about your orders here.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {}
            {activeTab === "issues" && (
              <div>
                <div className="space-y-4">
                  {issues.length > 0 ? (
                    issues.map((issue) => (
                      <div key={issue._id} className="p-4 rounded-lg border border-gray-200 bg-white">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-sm font-medium text-gray-900">{issue.title}</h3>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(issue.priority)}`}>
                                {issue.priority}
                              </span>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                issue.status === 'open' ? 'bg-red-100 text-red-800' :
                                issue.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                                issue.status === 'resolved' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {issue.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{issue.description}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span className="flex items-center">
                                {issue.category}
                              </span>
                              <span className="flex items-center">
                                {new Date(issue.createdAt).toLocaleDateString()}
                              </span>
                              {issue.relatedOrder && (
                                <span className="flex items-center">
                                  #{issue.relatedOrder.paystackReference}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No issues reported</h3>
                      <p className="text-gray-500 mb-4">You haven&apos;t reported any issues yet.</p>
                      <button
                        onClick={() => setShowIssueModal(true)}
                        className="bg-blue-600 text-white px-4 py-2"
                      >
                        Report an Issue
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {}
      {showIssueModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white border max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-semibold text-gray-900">Report an Issue</h2>
                </div>
                <button
                  onClick={() => setShowIssueModal(false)}
                  className="text-gray-400 p-1 border"
                >
                  Close
                </button>
              </div>
              
              <form onSubmit={handleCreateIssue} className="space-y-4">
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    Issue Title
                  </label>
                  <input
                    type="text"
                    required
                    value={issueForm.title}
                    onChange={(e) => setIssueForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border"
                    placeholder="Brief description of the issue"
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={issueForm.description}
                    onChange={(e) => setIssueForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border"
                    placeholder="Please provide detailed information about the issue..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={issueForm.category}
                      onChange={(e) => setIssueForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border"
                    >
                      <option value="payment">Payment Issue</option>
                      <option value="delivery">Delivery Problem</option>
                      <option value="product_quality">Product Quality</option>
                      <option value="seller_issue">Seller Issue</option>
                      <option value="technical">Technical Problem</option>
                      <option value="refund">Refund Request</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      value={issueForm.priority}
                      onChange={(e) => setIssueForm(prev => ({ ...prev, priority: e.target.value }))}
                      className="w-full px-3 py-2 border"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowIssueModal(false)}
                    className="px-4 py-2 text-gray-700 border"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white"
                  >
                    Submit Issue
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerDashboard;