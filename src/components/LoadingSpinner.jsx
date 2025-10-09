const LoadingSpinner = () => {
	return (
		<div className='flex items-center justify-center min-h-screen bg-white'>
			<div className='text-center'>
				<div className='w-8 h-8 border-2 border-gray-300 rounded-full mx-auto mb-2' />
				<div className='text-gray-600'>Loading...</div>
			</div>
		</div>
	);
};

export default LoadingSpinner;
