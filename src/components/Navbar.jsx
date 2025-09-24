import { ShoppingCart, UserPlus, LayoutDashboard, LogIn, LogOut, Lock , Home as HomeIcon  } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

const Navbar = () => {
	const { user, logout, role, switchRole, isAdmin } = useUserStore();
	const { cart } = useCartStore();

	return (
		<header className='fixed top-0 left-0 w-full bg-white border-b border-gray-300 z-40'>
			<div className='container mx-auto px-4 py-3'>
				<div className='flex flex-wrap justify-between items-center'>
					<Link to='/' className='text-2xl font-bold text-blue-600 items-center space-x-2 flex'>
						B-MART
					</Link>

					<nav className='flex flex-wrap items-center gap-4'>
					<Link
	to={"/"}
	className='text-gray-600 hover:text-blue-600 flex items-center'
>
	<HomeIcon size={18} className='mr-1' />
	<span className='hidden sm:inline'>Home</span>
</Link>

						{user && (
							<Link
								to={"/cart"}
								className='relative text-gray-600 hover:text-blue-600'
							>
								<ShoppingCart className='inline-block mr-1' size={20} />
								<span className='hidden sm:inline'>Cart</span>
								{cart.length > 0 && (
									<span
										className='absolute -top-2 -left-2 bg-blue-600 text-white rounded px-1 py-0.5 text-xs'
									>
										{cart.length}
									</span>
								)}
							</Link>
						)}
									{user && isAdmin() && (
										<Link
											className='bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded font-medium flex items-center'
											to={'/admin/dashboard'}
										>
											<LayoutDashboard className='inline-block mr-1' size={18} />
											<span className='hidden sm:inline'>Admin Dashboard</span>
										</Link>
									)}
						{user && !isAdmin() && role === 'seller' && (
							<Link
								className='bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded font-medium flex items-center'
								to={'/seller/dashboard'}
							>
								<LayoutDashboard className='inline-block mr-1' size={18} />
								<span className='hidden sm:inline'>Seller Dashboard</span>
							</Link>
						)}
						{user && !isAdmin() && role === 'buyer' && (
							<Link
								className='bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded font-medium flex items-center'
								to={'/buyer/dashboard'}
							>
								<LayoutDashboard className='inline-block mr-1' size={18} />
								<span className='hidden sm:inline'>Buyer Dashboard</span>
							</Link>
						)}

						{user && !isAdmin() && (
							<div className="flex items-center gap-2">
								<select
									value={role}
									onChange={e => switchRole(e.target.value)}
									className="bg-gray-100 text-gray-900 rounded px-2 py-1 border border-gray-300"
								>
									<option value="buyer">Buyer</option>
									{user.role === "seller" && <option value="seller">Seller</option>}
								</select>
								<span className="text-xs text-blue-600">Role: {role}</span>
							</div>
						)}
						{user ? (
							<button
								className='bg-gray-200 hover:bg-gray-300 text-gray-900 py-2 px-4 
						rounded flex items-center'
								onClick={logout}
							>
								<LogOut size={18} />
								<span className='hidden sm:inline ml-2'>Log Out</span>
							</button>
						) : (
							<>
								<Link
									to={"/signup"}
									className='bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 
									rounded flex items-center'
								>
									<UserPlus className='mr-2' size={18} />
									Sign Up
								</Link>
								<Link
									to={"/login"}
									className='bg-gray-200 hover:bg-gray-300 text-gray-900 py-2 px-4 
									rounded flex items-center'
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
