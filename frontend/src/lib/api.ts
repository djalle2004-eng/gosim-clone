import axios from 'axios';

// The Backend is running locally on port 5000 in development
export const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Global Axios Instance for SoufSim.
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

// Optional: Remove global response interceptor to handle unauthenticated ejects easily
api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);
