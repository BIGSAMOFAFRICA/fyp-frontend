import { ShoppingCart, UserPlus, LogIn, LogOut, Lock , Home as HomeIcon  } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

const Navbar = () => {
	const { user, logout, role, switchRole, isAdmin } = useUserStore();
	const { cart } = useCartStore();

	return (
		<header className='fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-emerald-800'>
			<div className='container mx-auto px-4 py-3'>
				<div className='flex flex-wrap justify-between items-center'>
					<Link to='/' className='text-2xl font-bold text-emerald-400 items-center space-x-2 flex'>
						B-MART
					</Link>

					<nav className='flex flex-wrap items-center gap-4'>
					<Link
	to={"/"}
	className='text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out flex items-center'
>
	<HomeIcon size={18} className='mr-1' />
	<span className='hidden sm:inline'>Home</span>
</Link>

						{user && (
							<Link
								to={"/cart"}
								className='relative group text-gray-300 hover:text-emerald-400 transition duration-300 
							ease-in-out'
							>
								<ShoppingCart className='inline-block mr-1 group-hover:text-emerald-400' size={20} />
								<span className='hidden sm:inline'>Cart</span>
								{cart.length > 0 && (
									<span
										className='absolute -top-2 -left-2 bg-emerald-500 text-white rounded-full px-2 py-0.5 
									text-xs group-hover:bg-emerald-400 transition duration-300 ease-in-out'
									>
										{cart.length}
									</span>
								)}
							</Link>
						)}
									{user && isAdmin() && (
										<Link
											className='bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium transition duration-300 ease-in-out flex items-center'
											to={'/admin/dashboard'}
										>
											<Lock className='inline-block mr-1' size={18} />
											<span className='hidden sm:inline'>Admin Dashboard</span>
										</Link>
									)}
						{user && !isAdmin() && role === 'seller' && (
							<Link
								className='bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium transition duration-300 ease-in-out flex items-center'
								to={'/seller/dashboard'}
							>
								<Lock className='inline-block mr-1' size={18} />
								<span className='hidden sm:inline'>Seller Dashboard</span>
							</Link>
						)}
						{user && !isAdmin() && role === 'buyer' && (
							<Link
								className='bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium transition duration-300 ease-in-out flex items-center'
								to={'/buyer/dashboard'}
							>
								<Lock className='inline-block mr-1' size={18} />
								<span className='hidden sm:inline'>Buyer Dashboard</span>
							</Link>
						)}

						{user && !isAdmin() && (
							<div className="flex items-center gap-2">
								<select
									value={role}
									onChange={e => switchRole(e.target.value)}
									className="bg-gray-700 text-white rounded px-2 py-1 border border-emerald-600 focus:outline-none"
								>
									<option value="buyer">Buyer</option>
									{user.role === "seller" && <option value="seller">Seller</option>}
								</select>
								<span className="text-xs text-emerald-400">Role: {role}</span>
							</div>
						)}
						{user ? (
							<button
								className='bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 
						rounded-md flex items-center transition duration-300 ease-in-out'
								onClick={logout}
							>
								<LogOut size={18} />
								<span className='hidden sm:inline ml-2'>Log Out</span>
							</button>
						) : (
							<>
								<Link
									to={"/signup"}
									className='bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 
									rounded-md flex items-center transition duration-300 ease-in-out'
								>
									<UserPlus className='mr-2' size={18} />
									Sign Up
								</Link>
								<Link
									to={"/login"}
									className='bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 
									rounded-md flex items-center transition duration-300 ease-in-out'
								>
									<LogIn className='mr-2' size={18} />
									Login
								</Link>
							</>
						)}
					</nav>
				</div>
			</div>
		</header>
	);
};
export default Navbar;
