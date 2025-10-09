import { Trash, Star, CheckCircle, XCircle, Clock } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";

const ProductsList = ({ moderationMode = false }) => {
	const { deleteProduct, toggleFeaturedProduct, products, approveProduct, rejectProduct } = useProductStore();

	const naira = price => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(price);

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
					text: "Pending",
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
		<div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
			<div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
				<h3 className="text-lg font-medium text-gray-900">
					{moderationMode ? "Pending Products" : "All Products"} ({products?.length || 0})
				</h3>
			</div>
			
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
								Category
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Featured
							</th>
							{moderationMode && (
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Status
								</th>
							)}
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Actions
							</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{products && products.length > 0 ? (
							products.map((product) => {
								const statusInfo = getStatusInfo(product.status);
								return (
									<tr key={product._id} className="hover:bg-gray-50">
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
													<div className="text-sm text-gray-500">ID: {product._id.slice(-8)}</div>
												</div>
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm font-medium text-gray-900">{naira(product.price)}</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
												{product.category}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<button
												onClick={() => toggleFeaturedProduct(product._id)}
												className={`p-2 rounded-lg  ${
													product.isFeatured 
														? "bg-yellow-100 text-yellow-600 hover:bg-yellow-200" 
														: "bg-gray-100 text-gray-400 hover:bg-gray-200"
												}`}
												title={product.isFeatured ? "Remove from featured" : "Add to featured"}
											>
												<Star className={`h-5 w-5 ${product.isFeatured ? "fill-current" : ""}`} />
											</button>
										</td>
										{moderationMode && (
											<td className="px-6 py-4 whitespace-nowrap">
												<span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${statusInfo.className}`}>
													{statusInfo.icon}
													<span className="ml-1">{statusInfo.text}</span>
												</span>
											</td>
										)}
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
											{moderationMode ? (
												<div className="flex space-x-2">
													<button
														onClick={() => approveProduct(product._id)}
														className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 "
													>
														<CheckCircle className="w-3 h-3 mr-1" />
														Approve
													</button>
													<button
														onClick={() => rejectProduct(product._id)}
														className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 "
													>
														<XCircle className="w-3 h-3 mr-1" />
														Reject
													</button>
												</div>
											) : (
												<button
													onClick={() => deleteProduct(product._id)}
													className="text-red-600 hover:text-red-900 "
													title="Delete product"
												>
													<Trash className="h-5 w-5" />
												</button>
											)}
										</td>
									</tr>
								);
							})
						) : (
							<tr>
								<td colSpan={moderationMode ? 6 : 5} className="px-6 py-12 text-center">
									<div className="text-gray-500">
										<div className="text-lg font-medium mb-2">No products found</div>
										<div className="text-sm">
											{moderationMode ? "No products are pending approval" : "No products have been created yet"}
										</div>
									</div>
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default ProductsList;