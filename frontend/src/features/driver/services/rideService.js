import axiosInstance from '../../../config/axios';

class DriverRideService {
  async getMyRides() {
    const response = await axiosInstance.get('/api/v1/rides/my-rides');
    return response.data;
  }

  async createRide(rideData) {
    const response = await axiosInstance.post('/api/v1/rides', rideData);
    return response.data;
  }

  async updateRide(rideId, updateData) {
    const response = await axiosInstance.put(`/api/v1/rides/${rideId}`, updateData);
    return response.data;
  }

  async deleteRide(rideId) {
    const response = await axiosInstance.delete(`/api/v1/rides/${rideId}`);
    return response.data;
  }

  async getRideDetails(rideId) {
    const response = await axiosInstance.get(`/api/v1/rides/${rideId}`);
    return response.data;
  }

  async bookRide(rideId, bookingData) {
    const response = await axiosInstance.post(`/api/v1/rides/${rideId}/book`, bookingData);
    return response.data;
  }

  async cancelBooking(rideId) {
    const response = await axiosInstance.delete(`/api/v1/rides/${rideId}/book`);
    return response.data;
  }
}

export default new DriverRideService(); 