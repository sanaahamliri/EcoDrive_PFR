import api from '../../../services/api/axiosConfig';

class DriverRideService {
  static async createRide(rideData) {
    try {
      const response = await api.post('/api/v1/rides', rideData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Erreur lors de la création du trajet';
    }
  }

  static async getMyRides() {
    try {
      const response = await api.get('/api/v1/rides/my-rides');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Erreur lors de la récupération des trajets';
    }
  }

  static async updateRide(rideId, updateData) {
    try {
      const response = await api.put(`/api/v1/rides/${rideId}`, updateData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Erreur lors de la mise à jour du trajet';
    }
  }

  static async deleteRide(rideId) {
    try {
      const response = await api.delete(`/api/v1/rides/${rideId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Erreur lors de la suppression du trajet';
    }
  }
}

export default DriverRideService; 