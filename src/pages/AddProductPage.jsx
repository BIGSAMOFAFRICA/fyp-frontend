import CreateProductForm from '../components/CreateProductForm';

const AddProductPage = () => (
  <div className='min-h-screen flex flex-col items-center justify-center py-16'>
    <h1 className='text-3xl font-bold text-emerald-400 mb-8'>Add a New Product</h1>
    <div className='w-full max-w-xl'>
      <CreateProductForm />
    </div>
  </div>
);

export default AddProductPage; 