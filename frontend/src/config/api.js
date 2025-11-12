// API Configuration
// This file centralizes the API base URL for easier environment management

// Use environment variable for API base URL
// In production: Set VITE_API_BASE_URL in Vercel environment variables
// In development: Defaults to localhost
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default API_BASE_URL;

// Helper function to construct full API URLs
export const getApiUrl = (path) => {
  // Remove leading slash if present, then add it back
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
};
