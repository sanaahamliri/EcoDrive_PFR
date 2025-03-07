import { API_ENDPOINTS } from '../config/api';

class AuthService {
  static TOKEN_KEY = 'token';

  static async login(email, password) {
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Échec de la connexion');
      }

      this.setToken(data.token);
      return data;
    } catch (error) {
      throw error;
    }
  }

  static async register(userData) {
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Échec de l\'inscription');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  static async logout() {
    try {
      // Appel au backend pour invalider le token si nécessaire
      await fetch(API_ENDPOINTS.AUTH.LOGOUT, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`,
        },
      });
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      this.removeToken();
    }
  }

  static setToken(token) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static removeToken() {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  static isAuthenticated() {
    return !!this.getToken();
  }
}

export default AuthService;
