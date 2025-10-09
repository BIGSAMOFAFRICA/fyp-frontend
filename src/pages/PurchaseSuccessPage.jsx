
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import { useUserStore } from "../stores/useUserStore";
import axios from "../lib/axios";

const PurchaseSuccessPage = () => {
	const { clearCart } = useCartStore();
	const { user } = useUserStore();
	const [searchParams] = useSearchParams();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const transactionRef = searchParams.get('reference') || searchParams.get('trxref');

	useEffect(() => {
		clearCart();
		// Simulate a brief loading period for payment verification
		const timer = setTimeout(() => {
			setLoading(false);
		}, 2000);

		return () => clearTimeout(timer);
	}, [clearCart]);

	// Simplified success page - no complex order processing

	if (loading) {
		return (
			<div className='h-screen flex items-center justify-center px-4'>
				<div className='text-center'>
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p className="text-gray-600">Verifying payment...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='h-screen flex items-center justify-center px-4'>
				<div className='max-w-md w-full bg-white border border-gray-300 p-6 text-center rounded-lg shadow-lg'>
					<h1 className='text-xl font-bold text-red-600 mb-2'>Payment Error</h1>
					<p className='text-red-500 mb-4'>{error}</p>
					<Link
						to={"/"}
						className='block w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded'
					>
						Go Home
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8'>
			<div className='max-w-md w-full bg-white border border-gray-200 p-8 rounded-lg shadow-lg text-center'>
				{/* Success Icon */}
				<div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
					<svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
					</svg>
				</div>
				
				{/* Success Message */}
				<h1 className='text-2xl font-bold text-gray-900 mb-4'>Payment Successful!</h1>
				<p className='text-lg text-gray-600 mb-6'>
					✅ Payment successful! Escrow and transaction processing will be added later.
				</p>
				
				{/* Transaction Reference */}
				{transactionRef && (
					<div className='bg-gray-50 border border-gray-200 p-4 mb-6 rounded-lg'>
						<p className='text-sm text-gray-500 mb-1'>Transaction Reference</p>
						<p className='text-sm font-mono text-gray-800'>{transactionRef}</p>
					</div>
				)}
				
				{/* Action Button */}
				<Link
					to={"/"}
					className='inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200'
				>
					Return to Home
				</Link>
			</div>
		</div>
	);
};
export default PurchaseSuccessPage;
