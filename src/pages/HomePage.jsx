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
    <div className='relative min-h-screen text-white overflow-hidden'>
      {/* Welcome Section */}
      <div className='relative z-10 flex flex-col items-center justify-center h-full bg-black/50 backdrop-blur-sm'>
        <h1 className='text-5xl sm:text-6xl font-bold text-emerald-400 mb-4 text-center animate__animated animate__fadeIn animate__delay-1s'>
          Elevate Your Style at B-MART
        </h1>
        <p className='text-xl text-gray-300 text-center px-4 animate__animated animate__fadeIn animate__delay-2s'>
          Curated fashion, trending gadgets, and more — shop the best, look your best.
        </p>

        {/* Scroll Down Button */}
        <a href="#categories" className="mt-12 animate-bounce text-white">
          <div className="flex flex-col items-center">
            <span className="text-sm">Scroll Down</span>
            <svg
              className="w-6 h-6 mt-1 text-emerald-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </a>
      </div>

      {/* Categories Section */}
      <div id="categories" className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        <h2 className='text-center text-4xl sm:text-5xl font-bold text-emerald-400 mb-4 opacity-0 animate__animated animate__fadeIn animate__delay-3s'>
          Explore Our Categories
        </h2>
        <p className='text-center text-lg text-gray-300 mb-12 opacity-0 animate__animated animate__fadeIn animate__delay-4s'>
          Discover the latest trends in eco-friendly fashion
        </p>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {categories.map((category) => (
            <CategoryItem category={category} key={category.name} />
          ))}
        </div>

        {/* Featured Products */}
        {!isLoading && products.length > 0 && (
          <FeaturedProducts featuredProducts={products} />
        )}
      </div>
    </div>
  );
};

export default HomePage;
