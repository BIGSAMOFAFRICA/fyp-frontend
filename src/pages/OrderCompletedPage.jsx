import { Link } from "react-router-dom";
import { CheckCircle, Shield, Star, ArrowRight, Home } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "../lib/axios";

const OrderCompletedPage = () => {
	const [searchParams] = useSearchParams();
	const [orderDetails, setOrderDetails] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	
	const transactionRef = searchParams.get('reference') || searchParams.get('trxref');

	useEffect(() => {
		if (transactionRef) {
			fetchOrderDetails();
		} else {
			setLoading(false);
		}
	}, [transactionRef]);

	const fetchOrderDetails = async () => {
		try {
			const token = localStorage.getItem("accessToken");
			
			const response = await axios.get(`/payments/verify-and-process/${transactionRef}`, {
				headers: { Authorization: `Bearer ${token}` }
			});
			
			if (response.data.success) {
				setOrderDetails(response.data);
				setLoading(false);
			} else {
				setError("Unable to verify payment");
				setLoading(false);
			}
		} catch (err) {
			console.error("Error verifying payment:", err);
			
			
			if (err.response?.status === 400 || err.response?.status === 404) {
				window.location.href = `/purchase-cancel?reference=${transactionRef}&error=verification_failed`;
			} else {
				setError("Payment verification failed. Please contact support if you were charged.");
				setLoading(false);
			}
		}
	};

	if (loading) {
		return (
			<div className='h-screen flex items-center justify-center px-4'>
				<div className='text-center'>
					<div className='w-8 h-8 border-2 border-gray-300 rounded-full mx-auto mb-2'></div>
					<p className='text-gray-600'>Loading order details...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='h-screen flex items-center justify-center px-4'>
				<div className='max-w-md w-full bg-red-50 rounded-lg shadow-xl p-6 text-center'>
					<h1 className='text-2xl font-bold text-red-600 mb-2'>Error</h1>
					<p className='text-red-500 mb-4'>{error}</p>
					<Link
						to={"/"}
						className='bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg '
					>
						Go Home
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className='h-screen flex items-center justify-center px-4'>
			<div className='max-w-2xl w-full bg-gray-800 rounded-lg shadow-xl overflow-hidden relative z-10'>
				<div className='p-6 sm:p-8'>
					<div className='flex justify-center mb-6'>
						<div className='relative'>
							<CheckCircle className='text-emerald-400 w-16 h-16' />
							<Star className='text-yellow-400 w-8 h-8 absolute -bottom-2 -right-2' />
						</div>
					</div>
					
					<h1 className='text-2xl sm:text-3xl font-bold text-center text-emerald-400 mb-2'>
						Order Completed Successfully!
					</h1>

					<p className='text-gray-300 text-center mb-2'>
						Your order has been confirmed and completed by the seller.
					</p>
					<p className='text-emerald-400 text-center text-sm mb-6 flex items-center justify-center'>
						<Shield className='mr-2' size={16} />
						Payment released to seller - Transaction complete!
					</p>

					{}
					<div className='bg-gray-700 rounded-lg p-4 mb-6'>
						<div className='flex items-center mb-4'>
							<CheckCircle className='text-emerald-400 mr-2' size={20} />
							<h3 className='text-lg font-semibold text-gray-200'>Order Summary</h3>
						</div>
						
						{orderDetails ? (
							<div className='space-y-3'>
								<div className='flex items-center justify-between'>
									<span className='text-sm text-gray-400'>Transaction ID</span>
									<span className='text-sm font-mono text-emerald-400'>{orderDetails.paystackReference}</span>
								</div>
								<div className='flex items-center justify-between'>
									<span className='text-sm text-gray-400'>Product</span>
									<span className='text-sm font-semibold text-gray-200'>{orderDetails.productName}</span>
								</div>
								<div className='flex items-center justify-between'>
									<span className='text-sm text-gray-400'>Amount</span>
									<span className='text-sm font-semibold text-emerald-400'>₦{orderDetails.totalAmount?.toLocaleString()}</span>
								</div>
								<div className='flex items-center justify-between'>
									<span className='text-sm text-gray-400'>Seller</span>
									<span className='text-sm text-gray-300'>{orderDetails.sellerName}</span>
								</div>
								<div className='flex items-center justify-between'>
									<span className='text-sm text-gray-400'>Completed At</span>
									<span className='text-sm text-gray-300'>{orderDetails.confirmedAt ? new Date(orderDetails.confirmedAt).toLocaleString() : 'Just now'}</span>
								</div>
								<div className='flex items-center justify-between'>
									<span className='text-sm text-gray-400'>Status</span>
									<span className='text-sm font-semibold text-emerald-400'>✅ Completed</span>
								</div>
							</div>
						) : (
							<div className='space-y-3'>
								<div className='flex items-center justify-between'>
									<span className='text-sm text-gray-400'>Transaction ID</span>
									<span className='text-sm font-mono text-emerald-400'>{transactionRef || 'N/A'}</span>
								</div>
								<div className='flex items-center justify-between'>
									<span className='text-sm text-gray-400'>Completed At</span>
									<span className='text-sm text-gray-300'>{new Date().toLocaleString()}</span>
								</div>
								<div className='flex items-center justify-between'>
									<span className='text-sm text-gray-400'>Status</span>
									<span className='text-sm font-semibold text-emerald-400'>✅ Completed</span>
								</div>
							</div>
						)}
					</div>

					{}
					<div className='bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-4 mb-6'>
						<div className='flex items-start'>
							<CheckCircle className='text-emerald-400 mr-3 mt-1' size={20} />
							<div>
								<h4 className='text-emerald-400 font-semibold mb-2'>Transaction Complete</h4>
								<p className='text-emerald-200 text-sm'>
									Your order has been successfully completed! The seller has confirmed receipt 
									and your payment has been released. Thank you for your purchase!
								</p>
							</div>
						</div>
					</div>

					<div className='space-y-4'>
						<button
							className='w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4
             rounded-lg  flex items-center justify-center'
						>
							<Star className='mr-2' size={18} />
							Thank you for your purchase!
						</button>
						<Link
							to={"/"}
							className='w-full bg-gray-700 hover:bg-gray-600 text-emerald-400 font-bold py-2 px-4 
            rounded-lg  flex items-center justify-center'
						>
							<Home className='mr-2' size={18} />
							Continue Shopping
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OrderCompletedPage;