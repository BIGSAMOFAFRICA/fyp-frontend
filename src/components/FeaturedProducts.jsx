import { useEffect, useState } from "react";
import { ShoppingCart, ChevronLeft, ChevronRight, CheckCircle, Clock, XCircle } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";

const FeaturedProducts = ({ featuredProducts }) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [itemsPerPage, setItemsPerPage] = useState(4);

	const { addToCart } = useCartStore();

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth < 640) setItemsPerPage(1);
			else if (window.innerWidth < 1024) setItemsPerPage(2);
			else if (window.innerWidth < 1280) setItemsPerPage(3);
			else setItemsPerPage(4);
		};

		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const nextSlide = () => {
		setCurrentIndex((prevIndex) => prevIndex + itemsPerPage);
	};

	const prevSlide = () => {
		setCurrentIndex((prevIndex) => prevIndex - itemsPerPage);
	};

	const isStartDisabled = currentIndex === 0;
	const isEndDisabled = currentIndex >= featuredProducts.length - itemsPerPage;

	const naira = price => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(price);

	const getStatusInfo = (status) => {
		switch (status) {
			case "approved":
				return {
					icon: <CheckCircle className="w-4 h-4" />,
					text: "Available",
					className: "text-green-600 bg-green-50 border-green-200"
				};
			case "pending":
				return {
					icon: <Clock className="w-4 h-4" />,
					text: "Pending",
					className: "text-yellow-600 bg-yellow-50 border-yellow-200"
				};
			case "sold":
				return {
					icon: <XCircle className="w-4 h-4" />,
					text: "Sold",
					className: "text-red-600 bg-red-50 border-red-200"
				};
			default:
				return {
					icon: <XCircle className="w-4 h-4" />,
					text: "Unavailable",
					className: "text-gray-600 bg-gray-50 border-gray-200"
				};
		}
	};

	return (
		<div className="py-12 bg-gray-50">
			<div className="container mx-auto px-4">
				<div className="text-center mb-8">
					<h2 className="text-3xl font-bold text-gray-900 mb-2">Available Products</h2>
					<p className="text-gray-600">Browse our selection of quality products with escrow protection</p>
				</div>
				
				{featuredProducts && featuredProducts.length > 0 ? (
					<div className="relative">
						<div className="overflow-hidden">
							<div 
								className="flex"
								style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
							>
								{featuredProducts.map((product) => {
									const statusInfo = getStatusInfo(product.status);
									return (
										<div key={product._id} className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 flex-shrink-0 px-3">
											<div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md overflow-hidden h-full">
												{}
												<div className="relative h-48 overflow-hidden">
													<img 
														src={product.image} 
														alt={product.name} 
														className="w-full h-full object-cover"
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
													<p className="text-xl font-bold text-blue-600 mb-4">
														{naira(product.price)}
													</p>
													<button
														onClick={() => addToCart(product)}
														disabled={product.status !== "approved"}
														className={`w-full flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium  ${
															product.status === "approved"
																? "bg-blue-600 hover:bg-blue-700 text-white"
																: "bg-gray-300 text-gray-500 cursor-not-allowed"
														}`}
													>
														<ShoppingCart className="w-4 h-4 mr-2" />
														{product.status === "approved" ? "Add to Cart" : statusInfo.text}
													</button>
												</div>
											</div>
										</div>
									);
								})}
							</div>
						</div>
						
						{}
						{featuredProducts.length > itemsPerPage && (
							<>
								<button
									onClick={prevSlide}
									disabled={isStartDisabled}
									className={`absolute top-1/2 -left-4 transform -translate-y-1/2 p-2 rounded-full shadow-lg  ${
										isStartDisabled 
											? "bg-gray-300 text-gray-500 cursor-not-allowed" 
											: "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
									}`}
								>
									<ChevronLeft className="w-6 h-6" />
								</button>

								<button
									onClick={nextSlide}
									disabled={isEndDisabled}
									className={`absolute top-1/2 -right-4 transform -translate-y-1/2 p-2 rounded-full shadow-lg  ${
										isEndDisabled 
											? "bg-gray-300 text-gray-500 cursor-not-allowed" 
											: "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
									}`}
								>
									<ChevronRight className="w-6 h-6" />
								</button>
							</>
						)}
					</div>
				) : (
					<div className="text-center py-12">
						<div className="text-gray-500">
							<div className="text-lg font-medium mb-2">No products available</div>
							<div className="text-sm">Check back later for new products</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default FeaturedProducts;