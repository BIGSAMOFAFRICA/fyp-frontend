import { useState } from "react";
import { Link } from "react-router-dom";
import CategoryItem from "../components/CategoryItem";

const categories = [
  { href: "/jeans", name: "Jeans", imageUrl: "/jeans.jpg" },
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
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // Simple form handling - in a real app, you'd send this to a backend
    alert('Thank you for your message! We\'ll get back to you soon.');
    setContactForm({ name: '', email: '', message: '' });
  };

  return (
    <div className='min-h-screen text-gray-900'>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl sm:text-6xl font-bold mb-6">B-MART</h1>
          <p className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto">
            Your trusted marketplace for buying and selling with secure escrow protection
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/signup" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Browse Products
            </Link>
            <Link 
              to="/signup" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Start Selling
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">About B-MART</h2>
            <div className="max-w-4xl mx-auto text-lg text-gray-600 leading-relaxed">
              <p className="mb-6">
                B-MART is a comprehensive e-commerce platform designed to facilitate secure transactions between buyers and sellers. 
                Our platform provides a safe, reliable marketplace where users can buy and sell products with confidence, knowing 
                that their transactions are protected by our advanced escrow system.
              </p>
              <p className="mb-6">
                We understand the challenges of online commerce, which is why we&apos;ve implemented a robust escrow system that holds 
                funds securely until both parties are satisfied with their transaction. This ensures that buyers receive exactly 
                what they ordered, and sellers get paid for their products.
              </p>
              <p className="mb-6">
                Our platform features a user-friendly interface, comprehensive product management tools, and real-time transaction 
                tracking. Whether you&apos;re a buyer looking for quality products or a seller wanting to reach a wider audience, 
                B-MART provides the tools and security you need to succeed.
              </p>
              <p>
                Join thousands of satisfied users who trust B-MART for their online commerce needs. Experience the difference 
                that secure, reliable transactions can make in your buying and selling journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-lg text-gray-600">Everything you need is here</p>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {categories.map((category) => (
            <CategoryItem category={category} key={category.name} />
          ))}
        </div>
        </div>
      </section>


      {/* Contact Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-lg text-gray-600">Get in touch with our team</p>
          </div>
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">B-MART</h3>
            <p className="text-gray-400 mb-6">Your trusted marketplace for secure transactions</p>
            <div className="border-t border-gray-800 pt-6">
              <p className="text-gray-400">
                © 2025 B-MART. All rights reserved. Created by Olabisi Samuel.
              </p>
            </div>
          </div>
      </div>
      </footer>
    </div>
  );
};

export default HomePage;
