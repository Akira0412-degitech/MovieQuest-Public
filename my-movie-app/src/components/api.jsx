import axios from 'axios';

// Create a customized Axios instance
const api = axios.create({
  baseURL: 'https://localhost:3000', // The base URL for the backend API
  withCredentials: true, // Include cookies (httpOnly) in cross-origin requests
});

export default api;
