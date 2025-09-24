import { Trash, Star } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";

const ProductsList = ({ moderationMode = false }) => {
	const { deleteProduct, toggleFeaturedProduct, products, approveProduct, rejectProduct } = useProductStore();

	const naira = price => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(price);

	return (
		<div className="bg-gray-800 shadow rounded overflow-x-auto max-w-4xl mx-auto w-full">
			<table className="min-w-full divide-y divide-gray-700">
				<thead className="bg-gray-700">
					<tr>
						<th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Product</th>
						<th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Price</th>
						<th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Category</th>
						<th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Featured</th>
						{moderationMode && (
							<th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
						)}
						<th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
					</tr>
				</thead>
				<tbody className="bg-gray-800 divide-y divide-gray-700">
					{products && products.length > 0 ? (
						products.map((product) => (
							<tr key={product._id} className="hover:bg-gray-700 transition-colors">
								<td className="px-4 py-4 whitespace-nowrap">
									<div className="flex items-center">
										<div className="flex-shrink-0 h-10 w-10">
											<img
												className="h-10 w-10 rounded-full object-cover border border-gray-600"
												src={product.image}
												alt={product.name}
												onError={e => { e.target.src = '/vite.svg'; }}
											/>
										</div>
										<div className="ml-4">
											<div className="text-sm font-medium text-white">{product.name}</div>
										</div>
									</div>
								</td>
								<td className="px-4 py-4 whitespace-nowrap">
									<div className="text-sm text-gray-300">{naira(product.price)}</div>
								</td>
								<td className="px-4 py-4 whitespace-nowrap">
									<div className="text-sm text-gray-300">{product.category}</div>
								</td>
								<td className="px-4 py-4 whitespace-nowrap">
									<button
										onClick={() => toggleFeaturedProduct(product._id)}
										className={`p-1 rounded-full ${product.isFeatured ? "bg-yellow-400 text-gray-900" : "bg-gray-600 text-gray-300"} hover:bg-yellow-500 transition-colors duration-200`}
									>
										<Star className="h-5 w-5" />
									</button>
								</td>
								{moderationMode && (
									<td className="px-4 py-4 whitespace-nowrap">
										<span className="text-xs text-yellow-400">{product.status}</span>
									</td>
								)}
								<td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
									{moderationMode ? (
										<div className="flex gap-2">
											<button
												onClick={() => approveProduct(product._id)}
												className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded"
											>
												Approve
											</button>
											<button
												onClick={() => rejectProduct(product._id)}
												className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
											>
												Reject
											</button>
										</div>
									) : (
										<button
											onClick={() => deleteProduct(product._id)}
											className="text-red-400 hover:text-red-300"
										>
											<Trash className="h-5 w-5" />
										</button>
									)}
								</td>
							</tr>
						))
					) : (
						<tr>
							<td colSpan={moderationMode ? 6 : 5} className="px-4 py-8 text-center text-gray-400 text-lg">
								No products found.
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
};
export default ProductsList;
