import axios from 'axios';
import { API_URL, API_ENDPOINTS } from '../config/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

class AuthService {
  static async login(email, password) {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Une erreur est survenue';
    }
  }

  static async register(userData) {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Une erreur est survenue';
    }
  }

  static logout() {
    localStorage.removeItem('token');
  }
}

export default AuthService;