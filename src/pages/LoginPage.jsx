import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, Mail, Lock, ArrowRight, Loader } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";

const LoginPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const { login, loading, user, role, isAdmin } = useUserStore();
	const navigate = useNavigate();

	useEffect(() => {
			if (user) {
				if (isAdmin()) navigate("/admin/dashboard", { replace: true });
				else if (role === "seller") navigate("/seller/dashboard", { replace: true });
				else if (role === "buyer") navigate("/buyer/dashboard", { replace: true });
				else navigate("/", { replace: true });
			}
	}, [user, role, isAdmin, navigate]);

	const handleSubmit = (e) => {
		e.preventDefault();
		login(email, password);
	};

	return (
		<div className='flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
			<div className='sm:mx-auto sm:w-full sm:max-w-md'>
				<h2 className='mt-6 text-center text-3xl font-bold text-blue-600'>Login to your account</h2>
			</div>

			<div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
				<div className='bg-white py-8 px-4 border border-gray-300 rounded sm:px-10'>
					<form onSubmit={handleSubmit} className='space-y-6'>
						<div>
							<label htmlFor='email' className='block text-sm font-medium text-gray-700'>
								Email address
							</label>
							<div className='mt-1 relative'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<Mail className='h-5 w-5 text-gray-400' aria-hidden='true' />
								</div>
								<input
									id='email'
									type='email'
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className='block w-full px-3 py-2 pl-10 bg-white border border-gray-300 
									rounded placeholder-gray-400 focus:outline-none focus:border-blue-500 sm:text-sm'
									placeholder='sam@example.com'
								/>
							</div>
						</div>

						<div>
							<label htmlFor='password' className='block text-sm font-medium text-gray-700'>
								Password
							</label>
							<div className='mt-1 relative'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<Lock className='h-5 w-5 text-gray-400' aria-hidden='true' />
								</div>
								<input
									id='password'
									type='password'
									required
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className='block w-full px-3 py-2 pl-10 bg-white border border-gray-300 
									rounded placeholder-gray-400 focus:outline-none focus:border-blue-500 sm:text-sm'
									placeholder='••••••••'
								/>
							</div>
						</div>

						<button
							type='submit'
							className='w-full flex justify-center py-2 px-4 border border-transparent 
							rounded text-sm font-medium text-white bg-blue-600
							 hover:bg-blue-700 disabled:opacity-50'
							disabled={loading}
						>
							{loading ? (
								<>
									<Loader className='mr-2 h-5 w-5' aria-hidden='true' />
									Loading...
								</>
							) : (
								<>
									<LogIn className='mr-2 h-5 w-5' aria-hidden='true' />
									Login
								</>
							)}
						</button>
					</form>

					<p className='mt-8 text-center text-sm text-gray-600'>
						Not a member?{" "}
						<Link to='/signup' className='font-medium text-blue-600 hover:text-blue-700'>
							Sign up now <ArrowRight className='inline h-4 w-4' />
						</Link>
					</p>
					<p className='mt-4 text-center'>
						<Link to='/forgot-password' className='text-blue-600 hover:text-blue-700 text-sm'>
							Forgot your password?
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};
export default LoginPage;
