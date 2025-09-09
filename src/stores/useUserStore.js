// File: frontend/stores/useUserStore.js
// Instructions: Replace the existing `useUserStore.js` in `frontend/stores/` with this content.

import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

const getInitialRole = () => localStorage.getItem("role") || "buyer";

export const useUserStore = create((set, get) => ({
  user: null,
  role: getInitialRole(),
  loading: false,
  checkingAuth: true,
  isAdmin: () => get().user?.email === "olabisisamuelayomide@gmail.com",

  setRole: (role) => {
    if (get().user?.email === "olabisisamuelayomide@gmail.com") return;
    localStorage.setItem("role", role);
    set({ role });
  },

  switchRole: (role) => {
    if (!get().user) return;
    if (get().user.email === "olabisisamuelayomide@gmail.com") return;
    if (["buyer", "seller"].includes(role)) {
      localStorage.setItem("role", role);
      set({ role });
    }
  },

  signup: async ({ name, email, password, confirmPassword, role }, navigate) => {
    set({ loading: true });
    if (password !== confirmPassword) {
      set({ loading: false });
      return toast.error("Passwords do not match");
    }
    try {
      const res = await axios.post("/auth/signup", { name, email, password, role });
      if (res?.data) {
        
        set({ loading: false });
        toast.success("Please check your email to verify your account");
        navigate("/verify-email", { state: { email } });
      } else {
        set({ loading: false });
        toast.error("Signup failed: No response data");
      }
    } catch (error) {
      set({ loading: false });
      const message = error.response?.data?.message || "An error occurred during signup";
      toast.error(message);
    }
  },

  login: async (email, password, navigate) => {
    set({ loading: true });
    try {
      // Admin bypass: skip verification check for this email
      if (email === "olabisisamuelayomide@gmail.com") {
        const res = await axios.post("/auth/login", { email, password });
        if (res?.data) {
          set({ user: res.data, role: "admin", loading: false });
          localStorage.setItem("role", "admin");
          if (res.data.accessToken) localStorage.setItem("accessToken", res.data.accessToken);
        } else {
          set({ loading: false });
          toast.error("Login failed: No response data");
        }
        return;
      }
      // Normal user flow
      const res = await axios.post("/auth/login", { email, password });
      if (res?.data) {
        const isAdmin = res.data.email === "olabisisamuelayomide@gmail.com";
        set({ user: res.data, role: isAdmin ? "admin" : res.data.role, loading: false });
        localStorage.setItem("role", isAdmin ? "admin" : res.data.role);
        if (res.data.accessToken) localStorage.setItem("accessToken", res.data.accessToken);
      } else {
        set({ loading: false });
        toast.error("Login failed: No response data");
      }
    } catch (error) {
      set({ loading: false });
      const message = error.response?.data?.message || "An error occurred during login";
      if (error.response?.status === 403 && error.response?.data?.isVerified === false) {
        toast.error("Please verify your email to log in");
        navigate("/verify-email", { state: { email: error.response.data.email } });
      } else {
        toast.error(message);
      }
    }
  },

  logout: async () => {
    try {
      try {
        await Promise.race([
          axios.post("/auth/logout"),
          new Promise((resolve) => setTimeout(resolve, 3000)),
        ]);
      } catch (serverError) {
        console.error("Server error during logout:", serverError);
      }
      set({ user: null, role: "buyer" });
      localStorage.removeItem("role");
      localStorage.removeItem("accessToken");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Error during logout:", error);
      const message = error.response?.data?.message || "An error occurred during logout";
      toast.error(message);
      set({ user: null, role: "buyer" });
      localStorage.removeItem("role");
      localStorage.removeItem("accessToken");
    }
  },

  checkAuth: async () => {
    set({ checkingAuth: true });
    const token = localStorage.getItem("accessToken");
    if (!token) {
      set({ user: null, checkingAuth: false });
      return;
    }
    try {
      const res = await axios.get("/auth/profile");
      if (res?.data) {
        set({ user: res.data, role: localStorage.getItem("role") || res.data.role, checkingAuth: false });
      } else {
        set({ checkingAuth: false });
        toast.error("Failed to fetch profile");
      }
    } catch (error) {
      console.log("Auth check error:", error.message);
      set({ user: null, role: "buyer", checkingAuth: false });
    }
  },

  refreshToken: async () => {
    if (get().checkingAuth) return;
    set({ checkingAuth: true });
    try {
      const res = await axios.post("/auth/refresh-token");
      set({ checkingAuth: false });
      if (res?.data) {
        return res.data;
      } else {
        throw new Error("No data from refresh token");
      }
    } catch (error) {
      set({ user: null, role: "buyer", checkingAuth: false });
      throw error;
    }
  },
}));

let refreshPromise = null;

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (refreshPromise) {
          await refreshPromise;
        } else {
          refreshPromise = useUserStore.getState().refreshToken();
          await refreshPromise;
          refreshPromise = null;
        }

        return axios(originalRequest);
      } catch (refreshError) {
        useUserStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);