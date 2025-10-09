import { 
	Users, 
	BarChart, 
	PlusCircle, 
	ShoppingBasket, 
	DollarSign, 
	MessageSquare,
	Menu,
	X,
	Trash2,
	Home,
	AlertCircle,
	CheckCircle,
	Clock,
	TrendingUp
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../lib/axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

import CreateProductForm from "../components/CreateProductForm";
import ProductsList from "../components/ProductsList";
import AdminEscrowPage from "./AdminEscrowPage";
import { useProductStore } from "../stores/useProductStore";

const AdminPage = () => {
	const [activeTab, setActiveTab] = useState("dashboard");
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const { fetchAllProducts, fetchPendingProducts } = useProductStore();
	
	
	const [pendingTransactions, setPendingTransactions] = useState([]);
	const [txLoading, setTxLoading] = useState(false);
	const [issues, setIssues] = useState([]);
	const [issuesLoading, setIssuesLoading] = useState(false);
	const [users, setUsers] = useState([]);
	const [usersLoading, setUsersLoading] = useState(false);
			const [stats, setStats] = useState({ 
				users: 0, 
				products: 0, 
				totalSales: 0, 
				totalRevenue: 0,
				pendingProducts: 0,
				pendingTransactions: 0,
				openIssues: 0,
				adminRevenue: 0,
				completedTransactions: 0,
				releasedTransactions: 0
			});
	const [dailySalesData, setDailySalesData] = useState([]);
	const [statsLoading, setStatsLoading] = useState(true);

	const navigationItems = [
		{ id: "dashboard", label: "Dashboard", icon: Home },
		{ id: "users", label: "User Management", icon: Users },
		{ id: "pending", label: "Pending Products", icon: ShoppingBasket },
		{ id: "transactions", label: "Pending Transactions", icon: DollarSign },
		{ id: "escrow", label: "Escrow & Revenue", icon: DollarSign },
		{ id: "issues", label: "Support Issues", icon: MessageSquare },
		{ id: "products", label: "All Products", icon: ShoppingBasket },
		{ id: "create", label: "Create Product", icon: PlusCircle },
	];

	useEffect(() => {
		if (activeTab === "pending") fetchPendingProducts();
		else if (activeTab === "products") fetchAllProducts();
		else if (activeTab === "transactions") fetchPendingTx();
		else if (activeTab === "issues") fetchIssues();
		else if (activeTab === "users") fetchUsers();
		else if (activeTab === "dashboard") fetchStats();
	}, [fetchAllProducts, fetchPendingProducts, activeTab]);

	const fetchStats = async () => {
		setStatsLoading(true);
		try {
			const token = localStorage.getItem("accessToken");
			
			const [analyticsRes, pendingTxRes, issuesRes, pendingProductsRes, revenueRes] = await Promise.all([
				axios.get("/analytics", {
					headers: { Authorization: `Bearer ${token}` }
				}).catch(() => ({ data: { analyticsData: {}, dailySalesData: [] } })),
				axios.get("/payments/escrow/transactions", {
					headers: { Authorization: `Bearer ${token}` }
				}).catch(() => ({ data: { transactions: [] } })),
				axios.get("/issues/admin/all", {
					headers: { Authorization: `Bearer ${token}` }
				}).catch(() => ({ data: { issues: [] } })),
				axios.get("/products/pending", {
					headers: { Authorization: `Bearer ${token}` }
				}).catch(() => ({ data: { products: [] } })),
				axios.get("/payments/escrow/revenue", {
					headers: { Authorization: `Bearer ${token}` }
				}).catch(() => ({ data: { totalAdminRevenue: 0 } }))
			]);
			
			const analytics = analyticsRes.data.analyticsData || {};
			const pendingTx = (pendingTxRes.data.transactions || []).filter(tx => 
				tx.status === "pending" && !tx.isConfirmed
			);
			const openIssues = (issuesRes.data.issues || []).filter(issue => 
				issue.status === "open"
			);
			
			setStats({
				users: analytics.users ?? 0,
				products: analytics.products ?? 0,
				totalSales: analytics.totalSales ?? 0,
				totalRevenue: analytics.totalRevenue ?? 0,
				pendingProducts: pendingProductsRes.data.products?.length ?? 0,
				pendingTransactions: analytics.pendingTransactions ?? 0,
				openIssues: openIssues.length,
				adminRevenue: analytics.totalAdminRevenue ?? 0,
				completedTransactions: analytics.completedTransactions ?? 0,
				releasedTransactions: analytics.releasedTransactions ?? 0
			});
			
			setDailySalesData(analyticsRes.data.dailySalesData || []);
		} catch (error) {
			console.error("Error fetching stats:", error);
			setStats({ 
				users: 0, 
				products: 0, 
				totalSales: 0, 
				totalRevenue: 0,
				pendingProducts: 0,
				pendingTransactions: 0,
				openIssues: 0,
				adminRevenue: 0
			});
			setDailySalesData([]);
		} finally {
			setStatsLoading(false);
		}
	};

	const fetchUsers = async () => {
		setUsersLoading(true);
		try {
			const token = localStorage.getItem("accessToken");
			const res = await axios.get("/users/all", {
				headers: { Authorization: `Bearer ${token}` },
			});
			setUsers(res.data.users || []);
		} catch (err) {
			console.error("Error fetching users:", err);
			setUsers([]);
		} finally {
			setUsersLoading(false);
		}
	};

	const fetchPendingTx = async () => {
		setTxLoading(true);
		try {
			const token = localStorage.getItem("accessToken");
			const res = await axios.get("/payments/escrow/transactions", {
				headers: { Authorization: `Bearer ${token}` },
			});
			const pendingTx = (res.data.transactions || []).filter(tx => 
				tx.status === "pending" || (tx.status === "completed" && tx.isConfirmed)
			);
			setPendingTransactions(pendingTx);
		} catch (err) {
			console.error("Error fetching pending transactions:", err);
			setPendingTransactions([]);
		} finally {
			setTxLoading(false);
		}
	};

	const fetchIssues = async () => {
		setIssuesLoading(true);
		try {
			const token = localStorage.getItem("accessToken");
			const res = await axios.get("/issues/admin/all", {
				headers: { Authorization: `Bearer ${token}` },
			});
			setIssues(res.data.issues || []);
		} catch (err) {
			console.error("Error fetching issues:", err);
			setIssues([]);
		} finally {
			setIssuesLoading(false);
		}
	};

	const handleDeleteUser = async (userId, userName) => {
		if (!window.confirm(`Are you sure you want to delete ${userName}'s account? This action cannot be undone.`)) {
			return;
		}

		try {
			const token = localStorage.getItem("accessToken");
			await axios.delete(`/users/${userId}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			
			
			fetchUsers();
			fetchStats();
			alert("User account deleted successfully");
		} catch (err) {
			console.error("Error deleting user:", err);
			alert("Error deleting user account");
		}
	};

	const handleTxAction = async (id, action) => {
		setTxLoading(true);
		try {
			const token = localStorage.getItem("accessToken");
			
			if (action === "approve") {
				await axios.post("/payments/escrow/release", {
					escrowTransactionId: id
				}, {
					headers: { Authorization: `Bearer ${token}` },
				});
			} else if (action === "reject") {
				await axios.post("/payments/escrow/cancel", {
					escrowTransactionId: id
				}, {
					headers: { Authorization: `Bearer ${token}` },
				});
			}
			
			fetchPendingTx();
			fetchStats(); 
		} catch (err) {
			console.error("Error handling transaction action:", err);
			alert(`Error ${action}ing transaction`);
		} finally {
			setTxLoading(false);
		}
	};

	const renderContent = () => {
		switch (activeTab) {
			case "dashboard":
				return (
					<div className="space-y-6">
						<div className="bg-white border p-6">
							<div className="flex justify-between items-center">
								<div>
									<h2 className="text-xl font-semibold text-gray-900">Admin Dashboard</h2>
									<p className="text-sm text-gray-600 mt-1">Manage transactions and platform</p>
								</div>
								<button
									onClick={fetchStats}
									className="px-4 py-2 bg-blue-600 text-white text-sm font-medium"
								>
									Refresh
								</button>
							</div>
						</div>
						
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
							<div className="bg-white border p-4">
								<div>
									<p className="text-sm text-gray-600">Total Users</p>
									<p className="text-xl font-bold text-gray-900">
										{statsLoading ? '...' : stats.users}
									</p>
								</div>
							</div>
							
							<div className="bg-white border p-4">
								<div>
									<p className="text-sm text-gray-600">Total Products</p>
									<p className="text-xl font-bold text-gray-900">
										{statsLoading ? '...' : stats.products}
									</p>
								</div>
							</div>
							
							<div className="bg-white border p-4">
								<div>
									<p className="text-sm text-gray-600">Total Revenue</p>
									<p className="text-xl font-bold text-gray-900">
										{statsLoading ? '...' : `₦${stats.totalRevenue?.toLocaleString() || 0}`}
									</p>
								</div>
							</div>
							
							<div className="bg-white border p-4">
								<div>
									<p className="text-sm text-gray-600">Admin Revenue</p>
									<p className="text-xl font-bold text-gray-900">
										{statsLoading ? '...' : `₦${stats.adminRevenue?.toLocaleString() || 0}`}
									</p>
								</div>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div className="bg-white border p-4">
								<div>
									<p className="text-sm text-gray-600">Pending Orders</p>
									<p className="text-xl font-bold text-gray-900">
										{statsLoading ? '...' : stats.pendingTransactions}
									</p>
								</div>
							</div>
							
							<div className="bg-white border p-4">
								<div>
									<p className="text-sm text-gray-600">Completed Orders</p>
									<p className="text-xl font-bold text-gray-900">
										{statsLoading ? '...' : stats.completedTransactions}
									</p>
								</div>
							</div>
							
							<div className="bg-white border p-4">
								<div>
									<p className="text-sm text-gray-600">Released Orders</p>
									<p className="text-xl font-bold text-gray-900">
										{statsLoading ? '...' : stats.releasedTransactions}
									</p>
								</div>
							</div>
						</div>

					</div>
				);

			case "users":
				return (
					<div className="space-y-6">
						{}
						<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
							<div className="flex justify-between items-center">
								<div>
									<h2 className="text-xl font-semibold text-gray-900">User Management</h2>
									<p className="text-sm text-gray-600 mt-1">Manage registered users and their roles</p>
								</div>
								<button
									onClick={fetchUsers}
									className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium  flex items-center space-x-2"
								>
									<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
									</svg>
									<span>Refresh</span>
								</button>
							</div>
						</div>
						
						<div className="bg-white rounded-lg shadow-sm border">
							<div className="px-6 py-4 border-b">
								<h3 className="text-lg font-medium text-gray-900">All Users ({users.length})</h3>
							</div>
							
							{usersLoading ? (
								<div className="p-6 text-center text-gray-500">Loading users...</div>
							) : users.length === 0 ? (
								<div className="p-6 text-center text-gray-500">No users found</div>
							) : (
								<div className="overflow-x-auto">
									<table className="min-w-full divide-y divide-gray-200">
										<thead className="bg-gray-50">
											<tr>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													Name
												</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													Email
												</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													Role
												</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													Joined
												</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													Actions
												</th>
											</tr>
										</thead>
										<tbody className="bg-white divide-y divide-gray-200">
											{users.map((user) => (
												<tr key={user._id} className="hover:bg-gray-50">
													<td className="px-6 py-4 whitespace-nowrap">
														<div className="text-sm font-medium text-gray-900">{user.name}</div>
													</td>
													<td className="px-6 py-4 whitespace-nowrap">
														<div className="text-sm text-gray-500">{user.email}</div>
													</td>
													<td className="px-6 py-4 whitespace-nowrap">
														<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
															user.role === 'admin' ? 'bg-red-100 text-red-800' :
															user.role === 'seller' ? 'bg-blue-100 text-blue-800' :
															'bg-green-100 text-green-800'
														}`}>
															{user.role}
														</span>
													</td>
													<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
														{new Date(user.createdAt).toLocaleDateString()}
													</td>
													<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
														<button
															onClick={() => handleDeleteUser(user._id, user.name)}
															className="text-red-600 hover:text-red-900 flex items-center space-x-1"
														>
															<Trash2 className="w-4 h-4" />
															<span>Delete</span>
														</button>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							)}
						</div>
					</div>
				);

			case "transactions":
				return (
					<div className="space-y-6">
						{}
						<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
							<div className="flex justify-between items-center">
								<div>
									<h2 className="text-xl font-semibold text-gray-900">Pending Transactions</h2>
									<p className="text-sm text-gray-600 mt-1">Review and approve pending escrow transactions</p>
								</div>
								<button
									onClick={fetchPendingTx}
									className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium  flex items-center space-x-2"
								>
									<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
									</svg>
									<span>Refresh</span>
								</button>
							</div>
						</div>
						
						<div className="bg-white rounded-lg shadow-sm border">
							<div className="px-6 py-4 border-b">
								<h3 className="text-lg font-medium text-gray-900">Escrow Transactions ({pendingTransactions.length})</h3>
							</div>
							
							{txLoading ? (
								<div className="p-6 text-center text-gray-500">Loading transactions...</div>
							) : pendingTransactions.length === 0 ? (
								<div className="p-6 text-center text-gray-500">No pending transactions</div>
							) : (
								<div className="overflow-x-auto">
									<table className="min-w-full divide-y divide-gray-200">
										<thead className="bg-gray-50">
											<tr>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													Product
												</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													Buyer
												</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													Seller
												</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													Amount
												</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													Admin Share
												</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													Buyer Confirmation
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
											{pendingTransactions.map((tx) => (
												<tr key={tx._id} className="hover:bg-gray-50">
													<td className="px-6 py-4 whitespace-nowrap">
														<div className="text-sm font-medium text-gray-900">
															{tx.productId?.name || 'Product'}
														</div>
														<div className="text-sm text-gray-500">
															Code: {tx.confirmationCode}
														</div>
													</td>
													<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
														{tx.buyerId?.name || 'Unknown'}
													</td>
													<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
														{tx.sellerId?.name || 'Unknown'}
													</td>
													<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
														₦{Number(tx.totalAmount).toLocaleString()}
													</td>
													<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
														₦{Number(tx.adminShare).toLocaleString()}
													</td>
													<td className="px-6 py-4 whitespace-nowrap">
														{tx.buyerConfirmation ? (
															<div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
																tx.buyerConfirmation === 'received' 
																	? 'bg-green-100 text-green-800' 
																	: 'bg-red-100 text-red-800'
															}`}>
																{tx.buyerConfirmation === 'received' ? (
																	<CheckCircle className="w-3 h-3 mr-1" />
																) : (
																	<AlertCircle className="w-3 h-3 mr-1" />
																)}
																{tx.buyerConfirmation === 'received' ? 'Product Received' : 'Product Not Received'}
															</div>
														) : (
															<div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
																<Clock className="w-3 h-3 mr-1" />
																Awaiting Confirmation
															</div>
														)}
														{tx.buyerConfirmationNote && (
															<div className="text-xs text-gray-500 mt-1 max-w-xs truncate" title={tx.buyerConfirmationNote}>
																Note: {tx.buyerConfirmationNote}
															</div>
														)}
													</td>
													<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
														{new Date(tx.paidAt).toLocaleDateString()}
													</td>
													<td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
														{tx.buyerConfirmation === 'received' ? (
															<button
																onClick={() => handleTxAction(tx._id, "approve")}
																disabled={txLoading}
																className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-3 py-1 rounded text-sm flex items-center"
															>
																<CheckCircle className="w-3 h-3 mr-1" />
																Release Funds
															</button>
														) : tx.buyerConfirmation === 'not_received' ? (
															<div className="flex flex-col space-y-1">
																<button
																	onClick={() => handleTxAction(tx._id, "reject")}
																	disabled={txLoading}
																	className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-3 py-1 rounded text-sm flex items-center"
																>
																	<AlertCircle className="w-3 h-3 mr-1" />
																	Refund Buyer
																</button>
																<span className="text-xs text-red-600">Buyer reported issue</span>
															</div>
														) : (
															<div className="flex flex-col space-y-1">
																<span className="text-xs text-yellow-600">Waiting for buyer confirmation</span>
																<button
																	onClick={() => handleTxAction(tx._id, "reject")}
																	disabled={txLoading}
																	className="bg-gray-600 hover:bg-gray-700 disabled:opacity-50 text-white px-3 py-1 rounded text-sm"
																>
																	Cancel
																</button>
															</div>
														)}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							)}
						</div>
					</div>
				);

			case "escrow":
				return <AdminEscrowPage />;

			case "issues":
				return (
					<div className="space-y-6">
						{}
						<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
							<div className="flex justify-between items-center">
								<div>
									<h2 className="text-xl font-semibold text-gray-900">Support Issues</h2>
									<p className="text-sm text-gray-600 mt-1">Manage customer support requests and issues</p>
								</div>
								<button
									onClick={fetchIssues}
									className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium  flex items-center space-x-2"
								>
									<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
									</svg>
									<span>Refresh</span>
								</button>
							</div>
						</div>
						
						<div className="bg-white rounded-lg shadow-sm border">
							<div className="px-6 py-4 border-b">
								<h3 className="text-lg font-medium text-gray-900">Reported Issues ({issues.length})</h3>
							</div>
							
							{issuesLoading ? (
								<div className="p-6 text-center text-gray-500">Loading issues...</div>
							) : issues.length === 0 ? (
								<div className="p-6 text-center text-gray-500">No issues reported</div>
							) : (
								<div className="divide-y divide-gray-200">
									{issues.map((issue) => (
										<div key={issue._id} className="p-6">
											<div className="flex justify-between items-start mb-2">
												<div>
													<h3 className="text-lg font-semibold text-gray-900">{issue.title}</h3>
													<p className="text-gray-600 text-sm">By: {issue.reportedBy?.name}</p>
												</div>
												<div className="flex space-x-2">
													<span className={`px-2 py-1 rounded text-xs ${
														issue.status === 'open' ? 'bg-red-100 text-red-800' :
														issue.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
														issue.status === 'resolved' ? 'bg-green-100 text-green-800' :
														'bg-gray-100 text-gray-800'
													}`}>
														{issue.status}
													</span>
													<span className={`px-2 py-1 rounded text-xs ${
														issue.priority === 'urgent' ? 'bg-red-100 text-red-800' :
														issue.priority === 'high' ? 'bg-orange-100 text-orange-800' :
														issue.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
														'bg-blue-100 text-blue-800'
													}`}>
														{issue.priority}
													</span>
												</div>
											</div>
											<p className="text-gray-700 mb-2">{issue.description}</p>
											<div className="text-xs text-gray-500">
												Category: {issue.category} | Created: {new Date(issue.createdAt).toLocaleDateString()}
												{issue.relatedOrder && ` | Order: #${issue.relatedOrder.paystackReference}`}
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				);

			case "pending":
				return <ProductsList moderationMode />;
			case "products":
				return <ProductsList />;
			case "create":
				return <CreateProductForm />;
			default:
				return <div className="text-center text-gray-500 py-12">Select a section from the sidebar</div>;
		}
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{}
			{sidebarOpen && (
				<div 
					className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
					onClick={() => setSidebarOpen(false)}
				/>
			)}

			{}
			<div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform lg:translate-x-0 lg:static lg:inset-0 ${
				sidebarOpen ? 'translate-x-0' : '-translate-x-full'
			}`}>
				<div className="flex items-center justify-between h-14 px-4 border-b border-gray-200">
					<h1 className="text-lg font-semibold text-gray-900">Admin Panel</h1>
					<button
						onClick={() => setSidebarOpen(false)}
						className="lg:hidden text-gray-500 hover:text-gray-700"
					>
						<X className="w-5 h-5" />
					</button>
				</div>
				
				<nav className="mt-4">
					<div className="px-2 space-y-1">
						{navigationItems.map((item) => {
							const Icon = item.icon;
							return (
								<button
									key={item.id}
									onClick={() => {
										setActiveTab(item.id);
										setSidebarOpen(false);
									}}
									className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg  ${
										activeTab === item.id
											? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
											: 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
									}`}
								>
									<Icon className="mr-3 h-4 w-4" />
									{item.label}
								</button>
							);
						})}
					</div>
				</nav>
			</div>

			{}
			<div className="lg:pl-64">
				{}
				<div className="bg-white shadow-sm border-b border-gray-200">
					<div className="flex items-center justify-between h-14 px-6">
						<button
							onClick={() => setSidebarOpen(true)}
							className="lg:hidden text-gray-500 hover:text-gray-700"
						>
							<Menu className="w-5 h-5" />
						</button>
						
						<div className="flex items-center space-x-4">
							<span className="text-sm font-medium text-gray-700">
								Welcome, Admin
							</span>
						</div>
					</div>
				</div>

				{}
				<main className="p-6">
					{renderContent()}
				</main>
			</div>
		</div>
	);
};

export default AdminPage;