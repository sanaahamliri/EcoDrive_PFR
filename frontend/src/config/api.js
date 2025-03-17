import axios from 'axios';

export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/api/v1/auth/register',
    LOGIN: '/api/v1/auth/login',
    LOGOUT: '/api/v1/auth/logout',
    ME: '/api/v1/auth/me'
  },
  RIDES: {
    SEARCH: '/rides',
    GET: (id) => `/rides/${id}`,
    BOOK: (id) => `/rides/${id}/book`,
    CANCEL: (id) => `/rides/${id}/book`,
  },
  USERS: {
    PROFILE: '/users/me',
    TRIPS: '/users/me/trips',
    PREFERENCES: '/users/me/preferences',
    PHOTO: '/users/me/photo',
    PUBLIC: (id) => `/users/${id}`
  },
  REVIEWS: {
    BASE: '/reviews'
  }
};

// Création de l'instance axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Ajouter des intercepteurs pour le débogage
api.interceptors.request.use(
  config => {
    console.log('API Request:', config);
    return config;
  },
  error => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => {
    console.log('API Response:', response);
    return response;
  },
  error => {
    console.error('API Response Error:', error);
    return Promise.reject(error);
  }
);

export default api; 