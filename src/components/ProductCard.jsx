import toast from "react-hot-toast";
import { ShoppingCart, CheckCircle, Clock, XCircle } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

const ProductCard = ({ product }) => {
	const { user } = useUserStore();
	const { addToCart } = useCartStore();
	
	const handleAddToCart = () => {
		if (!user) {
			toast.error("Please login to add products to cart", { id: "login" });
			return;
		} else {
			addToCart(product);
		}
	};

	const getStatusInfo = () => {
		switch (product.status) {
			case "approved":
				return {
					icon: <CheckCircle className="w-4 h-4" />,
					text: "Available",
					className: "text-green-600 bg-green-50 border-green-200",
					buttonText: "Add to Cart",
					buttonClass: "bg-blue-600 hover:bg-blue-700"
				};
			case "pending":
				return {
					icon: <Clock className="w-4 h-4" />,
					text: "Pending Approval",
					className: "text-yellow-600 bg-yellow-50 border-yellow-200",
					buttonText: "Awaiting Approval",
					buttonClass: "bg-gray-400 cursor-not-allowed"
				};
			case "sold":
				return {
					icon: <XCircle className="w-4 h-4" />,
					text: "Sold",
					className: "text-red-600 bg-red-50 border-red-200",
					buttonText: "Sold",
					buttonClass: "bg-gray-400 cursor-not-allowed"
				};
			default:
				return {
					icon: <XCircle className="w-4 h-4" />,
					text: "Unavailable",
					className: "text-gray-600 bg-gray-50 border-gray-200",
					buttonText: "Unavailable",
					buttonClass: "bg-gray-400 cursor-not-allowed"
				};
		}
	};

	const statusInfo = getStatusInfo();

	return (
		<div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md">
			{}
			<div className="relative h-48 overflow-hidden rounded-t-lg">
				<img 
					className="w-full h-full object-cover" 
					src={product.image} 
					alt={product.name}
					onError={(e) => {
						e.target.src = '/placeholder-product.png';
					}}
				/>
				{}
				<div className={`absolute top-2 right-2 flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${statusInfo.className}`}>
					{statusInfo.icon}
					<span>{statusInfo.text}</span>
				</div>
			</div>

			{}
			<div className="p-4">
				<h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
					{product.name}
				</h3>
				
				{}
				<div className="mb-4">
					<span className="text-2xl font-bold text-blue-600">
						₦{Number(product.price).toLocaleString()}
					</span>
				</div>

				{}
				<button
					className={`w-full flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium text-white  ${statusInfo.buttonClass}`}
					onClick={handleAddToCart}
					disabled={product.status !== "approved"}
				>
					<ShoppingCart className="w-4 h-4 mr-2" />
					{statusInfo.buttonText}
				</button>

				{}
				{product.status === "approved" && (
					<div className="mt-3 text-xs text-gray-500 text-center">
						Protected by escrow system
					</div>
				)}
			</div>
		</div>
	);
};

export default ProductCard;