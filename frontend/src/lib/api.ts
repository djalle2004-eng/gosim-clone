import axios from 'axios';

// The Backend is running locally on port 5000 in development
export const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Global Axios Instance for GoSIM.
 * Automatically attaches cookies (withCredentials: true) ensuring the Backend's
 * JWT HTTPOnly architecture correctly authenticates every request without
 * relying on insecure LocalStorage mechanics.
 */
export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add global response interceptor to handle unauthenticated ejects easily
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If backend middleware throws 401 Unauthorized securely
    if (error.response && error.response.status === 401) {
      // Avoid redirect loops on the login page itself
      if (
        window.location.pathname !== '/login' &&
        window.location.pathname !== '/register' &&
        window.location.pathname !== '/verify'
      ) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
