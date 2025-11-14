// API Configuration
// This file centralizes the API base URL for easier environment management

// In development, Vite proxy will handle /api requests
// In production, you can set VITE_API_BASE_URL environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://test2-7nxj.onrender.com';

export default API_BASE_URL;

// Helper function to construct API URLs
export const getApiUrl = (path) => {
  // If using Vite dev server, use relative paths to leverage proxy
  if (import.meta.env.DEV) {
    return path.startsWith('/') ? path : `/${path}`;
  }
  // In production, use full URL
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
};
