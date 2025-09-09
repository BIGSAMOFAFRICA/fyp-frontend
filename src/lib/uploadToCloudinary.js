// Utility to upload an image to Cloudinary and return the URL
// Usage: import uploadToCloudinary from './uploadToCloudinary';





// Shared Cloudinary upload utility for Admin and Seller dashboards
// Reads config from Vite env (which must be set in .env as VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET)
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
  throw new Error("Cloudinary config missing: check VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in your .env");
}

/**
 * Uploads an image to Cloudinary and returns the secure_url.
 * @param {File} file - The image file to upload
 * @param {string} folder - The Cloudinary folder to upload to (e.g., 'admin_products' or 'seller_products')
 * @returns {Promise<string>} - The Cloudinary secure_url
 */
export default async function uploadToCloudinary(file, folder = "") {
  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  if (folder) formData.append("folder", folder);

  let response;
  try {
    response = await fetch(url, {
      method: "POST",
      body: formData,
    });
  } catch {
    throw new Error("Network error during image upload");
  }

  if (!response.ok) {
    let errorMsg = `Image upload failed (status ${response.status})`;
    if (response.status === 401) {
      errorMsg = "Unauthorized: Check your Cloudinary credentials and unsigned preset.";
    } else if (response.status === 400) {
      errorMsg = "Bad request: The image or preset may be invalid.";
    } else if (response.status === 500) {
      errorMsg = "Cloudinary server error. Please try again later.";
    }
    throw new Error(errorMsg);
  }
  const data = await response.json();
  if (!data.secure_url) {
    throw new Error("Image upload failed: No secure_url returned from Cloudinary.");
  }
  return data.secure_url;
}
