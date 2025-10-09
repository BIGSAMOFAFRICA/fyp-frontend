import { useEffect, useState } from "react";
import { Edit, Trash, CheckCircle, Clock, XCircle, Plus } from "lucide-react";
import axios from "../lib/axios";
import CreateProductForm from "./CreateProductForm";

const MyProductsList = () => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [editing, setEditing] = useState(null);
	const [message, setMessage] = useState("");

	const fetchMine = async () => {
		setLoading(true);
		setError("");
		try {
			const res = await axios.get("/products/mine");
			setProducts(res.data.products || []);
		} catch (err) {
			setError(err.response?.data?.message || "Failed to load products");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchMine();
	}, []);

	const startEdit = (product) => {
		setEditing(product);
		setMessage("");
		setError("");
	};

	const cancelEdit = () => {
		setEditing(null);
	};

	const handleDelete = async (productId) => {
		const ok = window.confirm("Are you sure you want to delete this product? This action cannot be undone.");
		if (!ok) return;
		setMessage("");
		setError("");
		try {
			await axios.delete(`/products/${productId}`);
			setProducts((prev) => prev.filter((p) => p._id !== productId));
			setMessage("Product deleted successfully.");
		} catch (err) {
			setError(err.response?.data?.message || "Delete failed");
		}
	};

	const handleUpdate = async (formData) => {
		if (!editing) return;
		setMessage("");
		setError("");
		try {
			const res = await axios.put(`/products/${editing._id}`, formData);
			const updated = res.data;
			setProducts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
			setEditing(null);
			setMessage("Product updated successfully. It will be reviewed by admin.");
		} catch (err) {
			setError(err.response?.data?.message || "Update failed");
		}
	};

	const getStatusInfo = (status) => {
		switch (status) {
			case "approved":
				return {
					icon: <CheckCircle className="w-4 h-4" />,
					text: "Approved",
					className: "text-green-600 bg-green-50 border-green-200"
				};
			case "pending":
				return {
					icon: <Clock className="w-4 h-4" />,
					text: "Pending Review",
					className: "text-yellow-600 bg-yellow-50 border-yellow-200"
				};
			case "rejected":
				return {
					icon: <XCircle className="w-4 h-4" />,
					text: "Rejected",
					className: "text-red-600 bg-red-50 border-red-200"
				};
			default:
				return {
					icon: <Clock className="w-4 h-4" />,
					text: status,
					className: "text-gray-600 bg-gray-50 border-gray-200"
				};
		}
	};

	return (
		<div className="bg-white rounded-lg shadow-sm border border-gray-200">
			<div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
				<div className="flex justify-between items-center">
					<h2 className="text-lg font-medium text-gray-900">My Products ({products.length})</h2>
					<button
						onClick={() => setEditing("new")}
						className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 "
					>
						<Plus className="w-4 h-4 mr-2" />
						Add Product
					</button>
				</div>
			</div>

			<div className="p-6">
				{}
				{error && (
					<div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
						<div className="text-sm text-red-600">{error}</div>
					</div>
				)}
				{message && (
					<div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
						<div className="text-sm text-green-600">{message}</div>
					</div>
				)}

				{}
				{loading ? (
					<div className="text-center py-8">
						<div className="text-gray-500">Loading your products...</div>
					</div>
				) : editing ? (
					<div>
						<CreateProductForm 
							initialProduct={editing === "new" ? null : editing} 
							onSuccess={() => {
								cancelEdit();
								fetchMine();
							}} 
						/>
						<div className="mt-4">
							<button 
								onClick={cancelEdit} 
								className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 "
							>
								Cancel
							</button>
						</div>
					</div>
				) : products.length === 0 ? (
					<div className="text-center py-12">
						<div className="text-gray-500">
							<div className="text-lg font-medium mb-2">No products yet</div>
							<div className="text-sm mb-4">Start by adding your first product</div>
							<button
								onClick={() => setEditing("new")}
								className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 "
							>
								<Plus className="w-4 h-4 mr-2" />
								Add Your First Product
							</button>
						</div>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Product
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Price
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Status
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Created
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{products.map((product) => {
									const statusInfo = getStatusInfo(product.status);
									return (
										<tr key={product._id} className="hover:bg-gray-50 ">
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="flex items-center">
													<div className="flex-shrink-0 h-12 w-12">
														<img
															className="h-12 w-12 rounded-lg object-cover border border-gray-200"
															src={product.image}
															alt={product.name}
															onError={e => { e.target.src = '/placeholder-product.png'; }}
														/>
													</div>
													<div className="ml-4">
														<div className="text-sm font-medium text-gray-900">{product.name}</div>
														<div className="text-sm text-gray-500">{product.category}</div>
													</div>
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="text-sm font-medium text-gray-900">
													₦{Number(product.price || 0).toLocaleString()}
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${statusInfo.className}`}>
													{statusInfo.icon}
													<span className="ml-1">{statusInfo.text}</span>
												</span>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
												{new Date(product.createdAt).toLocaleDateString()}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
												<div className="flex space-x-2">
													<button
														onClick={() => startEdit(product)}
														className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 "
													>
														<Edit className="w-3 h-3 mr-1" />
														Edit
													</button>
													<button
														onClick={() => handleDelete(product._id)}
														className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 "
													>
														<Trash className="w-3 h-3 mr-1" />
														Delete
													</button>
												</div>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	);
};

export default MyProductsList;