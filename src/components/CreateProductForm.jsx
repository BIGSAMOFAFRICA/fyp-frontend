import { useState } from "react";
import { useProductStore } from "../stores/useProductStore";


const categories = ["jeans", "t-shirts", "shoes", "glasses", "jackets", "suits", "bags", "gadgets" , "wrist-watchs"];


const CreateProductForm = ({ initialProduct = null, onSuccess }) => {
       const [newProduct, setNewProduct] = useState({
       	   name: "",
       	   description: "",
       	   price: "",
       	   category: "",
       	   image: "",
       });
       const [message, setMessage] = useState("");
       const [error, setError] = useState("");
       const { createProduct, loading } = useProductStore();

       
       useState(() => {
       	   if (initialProduct) {
       	   	   setNewProduct({
       	   	   	   name: initialProduct.name || "",
       	   	   	   description: initialProduct.description || "",
       	   	   	   price: initialProduct.price || "",
       	   	   	   category: initialProduct.category || "",
       	   	   	   image: "",
       	   	   });
       	   }
       }, [initialProduct]);

       const handleSubmit = async (e) => {
       	   e.preventDefault();
       	   setMessage("");
       	   setError("");
       	   if (!newProduct.image) {
       	   	   setError("Please choose an image.");
       	   	   return;
       	   }
       	   try {
       	   	   const payload = {
       	   	   	   name: newProduct.name,
       	   	   	   description: newProduct.description,
       	   	   	   price: newProduct.price,
       	   	   	   category: newProduct.category,
       	   	   	   image: newProduct.image,
       	   	   };
       	   	   await createProduct(payload);
       	   	   setMessage(initialProduct ? "Product updated and pending approval." : "Product submitted. Awaiting approval.");
       	   	   setNewProduct({ name: "", description: "", price: "", category: "", image: "" });
       	   	   onSuccess && onSuccess();
       	   } catch {
       	   	   setError("Failed to create product. Please try again.");
       	   }
       };

       const handleImageChange = (e) => {
       	   const file = e.target.files && e.target.files[0];
       	   if (!file) return;
       	   const reader = new FileReader();
       	   reader.onloadend = () => {
       	   	   setNewProduct((prev) => ({ ...prev, image: reader.result }));
       	   };
       	   reader.readAsDataURL(file);
       };

	return (
		<div className='bg-white border rounded p-6 mb-8 max-w-xl mx-auto'>
			<h2 className='text-xl font-semibold mb-4 text-gray-800'>Upload Product</h2>

			{error && <div className='mb-4 text-sm text-red-600'>{error}</div>}
			{message && <div className='mb-4 text-sm text-green-700'>{message}</div>}

			<form onSubmit={handleSubmit} className='space-y-4'>
				<div>
					<label htmlFor='name' className='block text-sm font-medium text-gray-700'>
						Name
					</label>
					<input
						type='text'
						id='name'
						name='name'
						value={newProduct.name}
						onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
						className='mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400'
						required
					/>
				</div>

				<div>
					<label htmlFor='description' className='block text-sm font-medium text-gray-700'>
						Description
					</label>
					<textarea
						id='description'
						name='description'
						value={newProduct.description}
						onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
						rows='3'
						className='mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400'
						required
					/>
				</div>

				<div>
					<label htmlFor='price' className='block text-sm font-medium text-gray-700'>
						Price
					</label>
					<input
						type='number'
						id='price'
						name='price'
						value={newProduct.price}
						onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
						step='0.01'
						className='mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400'
						required
					/>
				</div>

				<div>
					<label htmlFor='category' className='block text-sm font-medium text-gray-700'>
						Category
					</label>
					<select
						id='category'
						name='category'
						value={newProduct.category}
						onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
						className='mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400'
						required
					>
						<option value=''>Select a category</option>
						{categories.map((category) => (
							<option key={category} value={category}>
								{category}
							</option>
						))}
					</select>
				</div>

				<div>
					<label htmlFor='image' className='block text-sm font-medium text-gray-700'>Image</label>
					<input type='file' id='image' accept='image/*' onChange={handleImageChange} className='mt-1 block w-full text-sm text-gray-900' />
					{newProduct.image && <div className='mt-2 text-xs text-gray-600'>Image selected</div>}
				</div>

				<button
					type='submit'
					className='w-full py-2 px-4 rounded text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60'
					disabled={loading}
				>
					{loading ? "Submitting..." : "Submit"}
				</button>
			</form>
		</div>
	);
};
export default CreateProductForm;
