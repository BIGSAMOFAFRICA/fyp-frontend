import { useEffect } from "react";
import CategoryItem from "../components/CategoryItem";
import { useProductStore } from "../stores/useProductStore";
import FeaturedProducts from "../components/FeaturedProducts";

const categories = [
  { href: "/jeans", name: "Jeans", imageUrl: "/jean.jpg" },
  { href: "/t-shirts", name: "T-shirts", imageUrl: "/T-shirt.jpg" },
  { href: "/shoes", name: "Shoes", imageUrl: "/shoes.jpg" },
  { href: "/glasses", name: "Glasses", imageUrl: "/glasses.jpg" },
  { href: "/jackets", name: "Jackets", imageUrl: "/jackets.jpg" },
  { href: "/suits", name: "Suits", imageUrl: "/suits.jpg" },
  { href: "/bags", name: "Bags", imageUrl: "/bags.jpg" },
  { href: "/gadgets", name: "Gadgets", imageUrl: "/gadgets.jpg" },
  { href: "/wrist-watchs", name: "Wrist-watchs", imageUrl: "/wrist-watch.png" },
];

const HomePage = () => {
  const { fetchApprovedProducts, products, isLoading } = useProductStore();

  useEffect(() => {
    fetchApprovedProducts();
  }, [fetchApprovedProducts]);

  return (
    <div className='min-h-screen text-gray-900'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
        <h1 className='text-4xl sm:text-5xl font-bold text-blue-600 mb-2 text-center'>B-MART</h1>
        <p className='text-base text-gray-600 text-center mb-10'>Simple store with basic categories and featured items.</p>

        <div id="categories">
          <h2 className='text-2xl sm:text-3xl font-semibold text-blue-600 mb-2 text-center'>Categories</h2>
          <p className='text-center text-sm text-gray-600 mb-8'>Browse by what you need</p>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {categories.map((category) => (
            <CategoryItem category={category} key={category.name} />
          ))}
        </div>
        </div>

        {!isLoading && products.length > 0 && (
          <FeaturedProducts featuredProducts={products} />
        )}
      </div>
    </div>
  );
};

export default HomePage;
