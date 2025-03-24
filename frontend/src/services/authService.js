import api from "./api/axiosConfig";
import { API_ENDPOINTS } from "../config/api";

class AuthService {
  static listeners = new Set();

  static subscribe(listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  static notifyListeners() {
    this.listeners.forEach((listener) => listener());
  }

  static async register(userData) {
    try {
      console.log(
        "Full URL:",
        `${api.defaults.baseURL}${API_ENDPOINTS.AUTH.REGISTER}`
      );
      const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        this.notifyListeners();
      }
      return response.data;
    } catch (error) {
      console.error("Registration error:", error.response || error);
      throw (
        error.response?.data?.message || error.message || "Erreur l'inscription"
      );
    }
  }

  static updateUser(userData) {
    localStorage.setItem("user", JSON.stringify(userData));
    this.notifyListeners();
  }

  static async login(email, password) {
    try {
      console.log("Base URL:", api.defaults.baseURL);
      console.log("Login endpoint:", API_ENDPOINTS.AUTH.LOGIN);
      console.log(
        "Full URL:",
        `${api.defaults.baseURL}${API_ENDPOINTS.AUTH.LOGIN}`
      );

      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        this.notifyListeners();
      }
      return response.data;
    } catch (error) {
      console.error("Login error details:", {
        message: error.message,
        response: error.response,
        config: error.config,
      });
      throw (
        error.response?.data?.message ||
        error.message ||
        "Erreur lors de la connexion"
      );
    }
  }

  static async logout() {
    try {
      await api.get(API_ENDPOINTS.AUTH.LOGOUT);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      this.notifyListeners();
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  }

  static async getCurrentUser() {
    try {
      const response = await api.get(API_ENDPOINTS.AUTH.ME);
      return response.data;
    } catch (error) {
      throw error.message || "Erreur lors de la récupération du profil";
    }
  }

  // Méthodes utilitaires
  static getUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }

  static getToken() {
    return localStorage.getItem("token");
  }

  static isAuthenticated() {
    return !!this.getToken() && !!this.getUser();
  }

  static hasRole(role) {
    const user = this.getUser();
    return user && user.role === role;
  }
}

export default AuthService;
