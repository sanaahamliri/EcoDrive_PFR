import api from '../../../config/api';
import { ENDPOINTS } from '../../../constants/endpoints';

class TripService {
  async searchRides(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filters.from) params.append('departure.city', filters.from);
      if (filters.to) params.append('destination.city', filters.to);
      if (filters.date) {
        const date = new Date(filters.date);
        params.append('departureTime', date.toISOString());
      }
      if (filters.seats) params.append('availableSeats', filters.seats);
      if (filters.maxPrice) params.append('price', filters.maxPrice);

      const queryString = params.toString();
      const url = `${ENDPOINTS.RIDES.SEARCH}${queryString ? `?${queryString}` : ''}`;
      
      console.log('Fetching rides from:', url);
      const response = await api.get(url);
      
      if (response.data && response.data.success) {
        return response.data.data.map(ride => ({
          _id: ride._id,
          departure: ride.departure.city,
          destination: ride.destination.city,
          date: ride.departureTime,
          time: new Date(ride.departureTime).toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
          }),
          price: ride.price,
          seats: ride.remainingSeats,
          features: this.getFeatures(ride.preferences),
          status: ride.status,
          driver: {
            name: `${ride.driver.firstName} ${ride.driver.lastName}`,
            image: ride.driver.avatar || "/placeholder.svg",
            rating: ride.driver.stats?.rating || 0
          }
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Search rides error:', error);
      throw this.handleError(error);
    }
  }

  getFeatures(preferences) {
    const features = [];
    if (preferences) {
      if (!preferences.smoking) features.push('Non-fumeur');
      if (preferences.music) features.push('Musique');
      if (preferences.pets) features.push('Animaux autorisés');
    }
    return features;
  }

  async bookRide(rideId, seats = 1) {
    try {
      const response = await api.post(ENDPOINTS.RIDES.BOOK(rideId), {
        seats,
        status: 'pending'
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async cancelBooking(rideId) {
    try {
      const response = await api.delete(ENDPOINTS.RIDES.CANCEL(rideId));
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response?.data?.error) {
      return error.response.data.error;
    }
    return 'Une erreur est survenue';
  }
}

export default new TripService();

