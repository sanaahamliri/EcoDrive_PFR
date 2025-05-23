import axios from "axios";
import api from "../../../services/api/axiosConfig";
import { API_ENDPOINTS } from "../../../config/api";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

class DriverRideService {
  async getMyRides() {
    console.log("Fetching my rides...");
    const response = await axios.get(`${API_URL}/rides/my-rides`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    console.log("My rides response:", response.data);
    return response.data;
  }

  async createRide(rideData) {
    const response = await axios.post(`${API_URL}/rides`, rideData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  }

  async updateRide(rideId, updateData) {
    const response = await axios.put(`${API_URL}/rides/${rideId}`, updateData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  }

  async deleteRide(rideId) {
    const response = await axios.delete(`${API_URL}/rides/${rideId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  }

  async getRideDetails(rideId) {
    const response = await axios.get(`${API_URL}/rides/${rideId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  }

  async bookRide(rideId, bookingData) {
    const response = await axios.post(
      `${API_URL}/rides/${rideId}/book`,
      bookingData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  }

  async cancelBooking(rideId) {
    const response = await axios.delete(`${API_URL}/rides/${rideId}/book`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  }

  async confirmBooking(rideId, passengerId) {
    console.log("Confirming booking with:", { rideId, passengerId });
    const response = await axios.post(
      `${API_URL}/rides/${rideId}/passengers/${passengerId}/confirm`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    console.log("Confirm booking response:", response.data);
    return response.data;
  }

  async rejectBooking(rideId, passengerId) {
    console.log("Rejecting booking with:", { rideId, passengerId });
    const response = await axios.post(
      `${API_URL}/rides/${rideId}/passengers/${passengerId}/reject`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    console.log("Reject booking response:", response.data);
    return response.data;
  }

  static async getRides(page = 1, limit = 5) {
    try {
      console.log(
        "Fetching rides from:",
        `${api.defaults.baseURL}${API_ENDPOINTS.RIDES.LIST}`
      );

      const response = await api.get(API_ENDPOINTS.RIDES.LIST, {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching rides:", error);
      throw error;
    }
  }
}

const rideService = new DriverRideService();
export default rideService;
