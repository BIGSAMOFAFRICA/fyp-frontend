import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios"; // Ensure this has baseURL: 'http://localhost:5000/api'

export const useProductStore = create((set, get) => ({
  products: [],
  loading: false,

  setProducts: (products) => set({ products }),

  createProduct: async (productData) => {
    set({ loading: true });
    try {
      const res = await axios.post("/products", productData);
      set((prevState) => ({
        products: [...prevState.products, res.data],
        loading: false,
      }));
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to create product");
      set({ loading: false });
    }
  },

  fetchAllProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/products/all");
      set({ products: response.data.products, loading: false });
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to fetch all products");
      set({ loading: false });
    }
  },

  fetchApprovedProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/products");
      set({ products: response.data.products, loading: false });
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to fetch approved products");
      set({ loading: false });
    }
  },

  fetchPendingProducts: async () => {
    set({ loading: true });
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get("/products/pending", {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ products: response.data, loading: false });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch pending products");
      set({ loading: false });
    }
  },

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
      console.error("Approve product error:", error);
      toast.error(error.response?.data?.message || "Failed to approve product");
      set({ loading: false });
    }
  },

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

  fetchProductsByCategory: async (category) => {
    set({ loading: true });
    try {
      const response = await axios.get(`/products/category/${category}`);
      set({ products: response.data.products, loading: false });
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to fetch products by category");
      set({ loading: false });
    }
  },

  deleteProduct: async (productId) => {
    set({ loading: true });
    try {
      await axios.delete(`/products/${productId}`);
      set((prevProducts) => ({
        products: prevProducts.products.filter((product) => product._id !== productId),
        loading: false,
      }));
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to delete product");
      set({ loading: false });
    }
  },

  toggleFeaturedProduct: async (productId) => {
    set({ loading: true });
    try {
      const response = await axios.patch(`/products/${productId}`);
      set((prevProducts) => ({
        products: prevProducts.products.map((product) =>
          product._id === productId
            ? { ...product, isFeatured: response.data.isFeatured }
            : product
        ),
        loading: false,
      }));
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update product");
      set({ loading: false });
    }
  },

  fetchFeaturedProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/products/featured");
      set({ products: response.data, loading: false });
    } catch (error) {
      toast.error("Failed to fetch featured products");
      set({ loading: false });
    }
  },
}));
