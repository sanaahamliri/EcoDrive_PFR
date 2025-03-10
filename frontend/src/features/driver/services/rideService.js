import axios from 'axios';
import { API_URL } from '../../../config/api';

class DriverRideService {
  // Obtenir tous les trajets du conducteur
  async getMyRides() {
    const response = await axios.get(`${API_URL}/rides/my-rides`);
    return response.data;
  }

  // Créer un nouveau trajet
  async createRide(rideData) {
    const response = await axios.post(`${API_URL}/rides`, rideData);
    return response.data;
  }

  // Mettre à jour un trajet
  async updateRide(rideId, updateData) {
    const response = await axios.put(`${API_URL}/rides/${rideId}`, updateData);
    return response.data;
  }

  // Supprimer un trajet
  async deleteRide(rideId) {
    const response = await axios.delete(`${API_URL}/rides/${rideId}`);
    return response.data;
  }

  // Obtenir les détails d'un trajet spécifique
  async getRideDetails(rideId) {
    const response = await axios.get(`${API_URL}/rides/${rideId}`);
    return response.data;
  }
}

export default new DriverRideService(); 