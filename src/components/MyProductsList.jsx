import { useEffect, useState } from "react";
import axios from "../lib/axios";
import CreateProductForm from "./CreateProductForm";

const MyProductsList = () => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [editing, setEditing] = useState(null); // product being edited
	const [message, setMessage] = useState("");

	const fetchMine = async () => {
		setLoading(true);
		setError("");
		try {
			const res = await axios.get("/products/mine");
			setProducts(res.data.products || []);
		} catch (err) {
			setError(err.response?.data?.message || "Failed to load products");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchMine();
	}, []);

	const startEdit = (product) => {
		setEditing(product);
		setMessage("");
		setError("");
	};

	const cancelEdit = () => {
		setEditing(null);
	};

	const handleDelete = async (productId) => {
		const ok = window.confirm("Delete this product?");
		if (!ok) return;
		setMessage("");
		setError("");
		try {
			await axios.delete(`/products/${productId}`);
			setProducts((prev) => prev.filter((p) => p._id !== productId));
			setMessage("Product deleted.");
		} catch (err) {
			setError(err.response?.data?.message || "Delete failed");
		}
	};

	const handleUpdate = async (formData) => {
		if (!editing) return;
		setMessage("");
		setError("");
		try {
			const res = await axios.put(`/products/${editing._id}`, formData);
			const updated = res.data;
			setProducts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
			setEditing(null);
			setMessage("Product updated and pending approval.");
		} catch (err) {
			setError(err.response?.data?.message || "Update failed");
		}
	};

	return (
		<div className='bg-white border rounded p-4'>
			<h2 className='text-lg font-semibold mb-4 text-gray-800'>My Products</h2>
			{error && <div className='mb-3 text-sm text-red-600'>{error}</div>}
			{message && <div className='mb-3 text-sm text-green-700'>{message}</div>}

			{loading ? (
				<div>Loading...</div>
			) : editing ? (
				<div>
					<CreateProductForm initialProduct={editing} onSuccess={cancelEdit} />
					<div className='mt-3'>
						<button onClick={cancelEdit} className='px-3 py-2 rounded bg-gray-200 text-gray-800'>Cancel</button>
					</div>
				</div>
			) : products.length === 0 ? (
				<div className='text-sm text-gray-600'>No products yet.</div>
			) : (
				<div className='overflow-x-auto'>
					<table className='min-w-full text-sm text-left'>
						<thead>
							<tr className='text-gray-700'>
								<th className='py-2 pr-4'>Name</th>
								<th className='py-2 pr-4'>Price</th>
								<th className='py-2 pr-4'>Status</th>
								<th className='py-2 pr-4'>Actions</th>
							</tr>
						</thead>
						<tbody>
							{products.map((p) => (
								<tr key={p._id} className='border-t'>
									<td className='py-2 pr-4'>{p.name}</td>
									<td className='py-2 pr-4'>₦{Number(p.price || 0).toLocaleString()}</td>
									<td className='py-2 pr-4 capitalize'>{p.status}</td>
									<td className='py-2 pr-4'>
										<button onClick={() => startEdit(p)} className='mr-2 px-3 py-1 rounded bg-gray-800 text-white'>Edit</button>
										<button onClick={() => handleDelete(p._id)} className='px-3 py-1 rounded bg-red-600 text-white'>Delete</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
};

export default MyProductsList;
