import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios"; // Make sure baseURL is set in axios

export const useProductStore = create((set, get) => ({
  products: [],
  loading: false,

  setProducts: (products) => set({ products }),

  // CREATE PRODUCT
  createProduct: async (productData) => {
    set({ loading: true });
    try {
      const res = await axios.post("/products", productData);
      set((prevState) => ({
        products: [...prevState.products, res.data],
        loading: false,
      }));
      toast.success("Product created successfully");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to create product");
      set({ loading: false });
    }
  },

  // FETCH ALL PRODUCTS (ADMIN)
  fetchAllProducts: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/products/all");
      set({ products: res.data.products, loading: false });
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to fetch all products");
      set({ loading: false });
    }
  },

  // FETCH APPROVED PRODUCTS (HOME PAGE)
  fetchApprovedProducts: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/products");
      set({ products: res.data.products, loading: false });
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to fetch approved products");
      set({ loading: false });
    }
  },

  // FETCH PENDING PRODUCTS (ADMIN)
  fetchPendingProducts: async () => {
    set({ loading: true });
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get("/products/pending", {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ products: res.data.products || res.data, loading: false });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch pending products");
      set({ loading: false });
    }
  },

  // APPROVE PRODUCT (ADMIN)
  approveProduct: async (productId) => {
    set({ loading: true });
    try {
      const token = localStorage.getItem("accessToken");
      await axios.patch(`/products/${productId}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((prev) => ({
        products: prev.products.filter((p) => p._id !== productId),
        loading: false,
      }));
      toast.success("Product approved");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to approve product");
      set({ loading: false });
    }
  },

  // REJECT PRODUCT (ADMIN)
  rejectProduct: async (productId) => {
    set({ loading: true });
    try {
      const token = localStorage.getItem("accessToken");
      await axios.patch(`/products/${productId}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((prev) => ({
        products: prev.products.filter((p) => p._id !== productId),
        loading: false,
      }));
      toast.success("Product rejected");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject product");
      set({ loading: false });
    }
  },

  // FETCH PRODUCTS BY CATEGORY
  fetchProductsByCategory: async (category) => {
    set({ loading: true });
    try {
      const res = await axios.get(`/products/category/${category}`);
      set({ products: res.data.products, loading: false });
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to fetch products by category");
      set({ loading: false });
    }
  },

  // DELETE PRODUCT
  deleteProduct: async (productId) => {
    set({ loading: true });
    try {
      await axios.delete(`/products/${productId}`);
      set((prev) => ({
        products: prev.products.filter((product) => product._id !== productId),
        loading: false,
      }));
      toast.success("Product deleted");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to delete product");
      set({ loading: false });
    }
  },

  // TOGGLE FEATURED PRODUCT
  toggleFeaturedProduct: async (productId) => {
    set({ loading: true });
    try {
      const res = await axios.patch(`/products/${productId}`);
      set((prev) => ({
        products: prev.products.map((product) =>
          product._id === productId
            ? { ...product, isFeatured: res.data.isFeatured }
            : product
        ),
        loading: false,
      }));
      toast.success("Product featured status updated");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update product");
      set({ loading: false });
    }
  },

  // FETCH FEATURED PRODUCTS
  fetchFeaturedProducts: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/products/featured");
      set({ products: res.data, loading: false });
    } catch (error) {
      toast.error("Failed to fetch featured products");
      set({ loading: false });
    }
  },
}));
