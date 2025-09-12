import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://fyp-backend-9t8k.onrender.com/api',
  withCredentials: true,
});


// Add request interceptor to add Authorization header
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
