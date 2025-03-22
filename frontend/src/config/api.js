import axios from "axios";

export const API_URL = "http://localhost:5000/api/v1";

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
  },
  RIDES: {
    SEARCH: "/rides",
    GET: (id) => `/rides/${id}`,
    BOOK: (id) => `/rides/${id}/book`,
    CANCEL: (id) => `/rides/${id}/book`,
  },
  USERS: {
    PROFILE: "/users/me",
    TRIPS: "/users/me/trips",
    PREFERENCES: "/users/me/preferences",
    PHOTO: "/users/me/photo",
    PUBLIC: (id) => `/users/${id}`,
  },
  REVIEWS: {
    BASE: "/reviews",
  },
};

// Création de l'instance axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Ajouter des intercepteurs pour le débogage
api.interceptors.request.use(
  (config) => {
    console.log("API Request:", config);
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log("API Response:", response);
    return response;
  },
  (error) => {
    console.error("API Response Error:", error);
    return Promise.reject(error);
  }
);

// Fonction utilitaire pour vérifier si le token est expiré
const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp < Date.now() / 1000;
  } catch (e) {
    return true;
  }
};

export default api;
