import { BarChart, PlusCircle, ShoppingBasket } from "lucide-react";
import { useEffect, useState } from "react";

import AnalyticsTab from "../components/AnalyticsTab";
import CreateProductForm from "../components/CreateProductForm";
import ProductsList from "../components/ProductsList";
import { useProductStore } from "../stores/useProductStore";


const tabs = [
	{ id: "pending", label: "Pending Products", icon: ShoppingBasket },
	{ id: "transactions", label: "Pending Transactions", icon: BarChart },
	{ id: "products", label: "All Products", icon: ShoppingBasket },
	{ id: "create", label: "Create Product", icon: PlusCircle },
	{ id: "analytics", label: "Analytics", icon: BarChart },
];



import axios from "../lib/axios";

const AdminPage = () => {
	const [activeTab, setActiveTab] = useState("pending");
	const { fetchAllProducts, fetchPendingProducts } = useProductStore();
	const [pendingTransactions, setPendingTransactions] = useState([]);
	const [txLoading, setTxLoading] = useState(false);

	useEffect(() => {
		if (activeTab === "pending") fetchPendingProducts();
		else if (activeTab === "products") fetchAllProducts();
		else if (activeTab === "transactions") fetchPendingTx();
	}, [fetchAllProducts, fetchPendingProducts, activeTab]);

	const fetchPendingTx = async () => {
		setTxLoading(true);
		try {
			const token = localStorage.getItem("accessToken");
			const res = await axios.get("/products/transactions/pending", {
				headers: { Authorization: `Bearer ${token}` },
			});
			setPendingTransactions(res.data.transactions || []);
		} catch (err) {
			setPendingTransactions([]);
		} finally {
			setTxLoading(false);
		}
	};

	const handleTxAction = async (id, action) => {
		setTxLoading(true);
		try {
			const token = localStorage.getItem("accessToken");
			await axios.put(`/products/admin/transactions/${id}/${action}`, {}, {
				headers: { Authorization: `Bearer ${token}` },
			});
			fetchPendingTx();
		} catch {}
		setTxLoading(false);
	};

	// Analytics state
	const [stats, setStats] = useState({ users: 0, products: 0, totalSales: 0, totalRevenue: 0 });
	const [statsLoading, setStatsLoading] = useState(true);

	useEffect(() => {
		const fetchAnalytics = async () => {
			setStatsLoading(true);
			try {
				const axios = (await import("../lib/axios")).default;
				const res = await axios.get("/analytics");
				const analytics = res.data.analyticsData || {};
				setStats({
					users: analytics.users ?? 0,
					products: analytics.products ?? 0,
					totalSales: analytics.totalSales ?? 0,
					totalRevenue: analytics.totalRevenue ?? 0,
				});
			} catch {
				setStats({ users: 0, products: 0, totalSales: 0, totalRevenue: 0 });
			} finally {
				setStatsLoading(false);
			}
		};
		fetchAnalytics();
	}, []);

						return (
							<div className='min-h-screen relative overflow-hidden'>
								<div className='relative z-10 container mx-auto px-2 sm:px-4 py-8 sm:py-16'>
									<h1 className='text-3xl font-bold mb-8 text-emerald-400 text-center'>Admin Dashboard</h1>

									{/* Analytics section: Only these four cards, dynamically loaded */}
				<div className="mb-8 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
					<div className="bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center justify-center">
						<div className="text-gray-400 text-sm mb-1">Total Users</div>
						<div className="text-3xl font-bold text-emerald-400">
							{statsLoading ? 'Loading...' : stats.users}
						</div>
					</div>
					<div className="bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center justify-center">
						<div className="text-gray-400 text-sm mb-1">Total Products</div>
						<div className="text-3xl font-bold text-emerald-400">
							{statsLoading ? 'Loading...' : stats.products}
						</div>
					</div>
					<div className="bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center justify-center">
						<div className="text-gray-400 text-sm mb-1">Total Sales</div>
						<div className="text-3xl font-bold text-emerald-400">
							{statsLoading ? 'Loading...' : stats.totalSales}
						</div>
					</div>
					<div className="bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center justify-center">
						<div className="text-gray-400 text-sm mb-1">Total Revenue</div>
						<div className="text-3xl font-bold text-emerald-400">
							{statsLoading ? 'Loading...' : (typeof stats.totalRevenue === 'number' ? stats.totalRevenue.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' }) : '₦0')}
						</div>
					</div>
				</div>

									<div className='flex flex-wrap justify-center mb-8 gap-2'>
										{tabs.map((tab) => (
											<button
												key={tab.id}
												onClick={() => setActiveTab(tab.id)}
												className={`flex items-center px-4 py-2 rounded-md ${
													activeTab === tab.id
														? "bg-emerald-600 text-white"
														: "bg-gray-700 text-gray-300"
												}`}
											>
												<tab.icon className='mr-2 h-5 w-5' />
												{tab.label}
											</button>
										))}
									</div>
											{activeTab === "pending" && <ProductsList moderationMode />}
											{activeTab === "transactions" && (
												<div className="bg-gray-800 rounded-lg shadow p-6 max-w-3xl mx-auto">
													<h2 className="text-xl font-bold mb-4 text-emerald-400">Pending Transactions</h2>
													{txLoading ? (
														<div className="text-gray-400">Loading...</div>
													) : pendingTransactions.length === 0 ? (
														<div className="text-gray-400">No pending transactions</div>
													) : (
														<ul className="divide-y divide-gray-700">
															{pendingTransactions.map((tx) => (
																<li key={tx._id} className="py-3 flex justify-between items-center">
																	<div>
																		<span className="font-semibold">{tx.product?.name || 'Product'}</span> - ₦{Number(tx.amount).toLocaleString()}<br/>
																		<span className="text-xs text-gray-400">Buyer: {tx.buyer?.name || tx.buyerId}</span>
																	</div>
																	<div className="flex gap-2">
																		<button onClick={() => handleTxAction(tx._id, "approve")}
																			className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded">
																			Approve
																		</button>
																		<button onClick={() => handleTxAction(tx._id, "reject")}
																			className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded">
																			Reject
																		</button>
																	</div>
																</li>
															))}
														</ul>
													)}
												</div>
											)}
											{activeTab === "products" && <ProductsList />}
											{activeTab === "create" && <CreateProductForm />}
											{activeTab === "analytics" && <AnalyticsTab />}
									</div>
							</div>
						);
};

export default AdminPage;
