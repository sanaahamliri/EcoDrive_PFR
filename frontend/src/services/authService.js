import api from "../config/axios";
import { API_ENDPOINTS } from "../config/api";

class AuthService {
  static async register(userData) {
    try {
      console.log(
        "Full URL:",
        `${api.defaults.baseURL}${API_ENDPOINTS.AUTH.REGISTER}`
      );
      const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData);
      return response.data;
    } catch (error) {
      console.error("Registration error:", error.response || error);
      throw (
        error.response?.data?.message || error.message || "Erreur l'inscription"
      );
    }
  }

  static async login(email, password) {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.message || "Erreur lors de la connexion";
    }
  }

  static async logout() {
    try {
      await api.get(API_ENDPOINTS.AUTH.LOGOUT);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
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
