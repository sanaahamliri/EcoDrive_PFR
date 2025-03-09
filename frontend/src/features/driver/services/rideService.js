import api from '../../../services/api/axiosConfig';
import { API_ENDPOINTS } from '../../../config/api';

class DriverRideService {
  // Créer un nouveau trajet
  static async createRide(rideData) {
    try {
      const response = await api.post(API_ENDPOINTS.RIDES.BASE, rideData);
      return response.data;
    } catch (error) {
      throw error.message || 'Erreur lors de la création du trajet';
    }
  }

  // Obtenir tous les trajets du conducteur
  static async getMyRides() {
    try {
      const response = await api.get(API_ENDPOINTS.USERS.TRIPS);
      return response.data;
    } catch (error) {
      throw error.message || 'Erreur lors de la récupération des trajets';
    }
  }

  // Mettre à jour un trajet
  static async updateRide(rideId, updateData) {
    try {
      const response = await api.put(`${API_ENDPOINTS.RIDES.BASE}/${rideId}`, updateData);
      return response.data;
    } catch (error) {
      throw error.message || 'Erreur lors de la mise à jour du trajet';
    }
  }

  // Supprimer un trajet
  static async deleteRide(rideId) {
    try {
      const response = await api.delete(`${API_ENDPOINTS.RIDES.BASE}/${rideId}`);
      return response.data;
    } catch (error) {
      throw error.message || 'Erreur lors de la suppression du trajet';
    }
  }
}

export default DriverRideService; 