import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const PurchaseSuccess = () => {
	return (
		<div className='flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-6'>
			<CheckCircle size={80} className='text-green-500 mb-6' />
			<h1 className='text-3xl font-bold mb-2'>Purchase Successful</h1>
			<p className='text-lg mb-4'>Thank you for your order!</p>
			<Link to='/' className='bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition'>
				Return to Home
			</Link>
		</div>
	);
};

export default PurchaseSuccess; 