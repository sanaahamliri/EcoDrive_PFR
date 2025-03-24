import api from "../../../config/api";
import { ENDPOINTS } from "../../../constants/endpoints";
import axios from "axios";
import AuthService from "../../../services/authService";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

class TripService {
  updateLocalDriverData(tripData) {
    if (tripData?.driver) {
      const currentUser = AuthService.getUser();
      if (currentUser && currentUser._id === tripData.driver._id) {
        AuthService.updateUser({
          ...currentUser,
          ...tripData.driver,
        });
      }
    }
  }

  async searchRides(filters = {}, page = 1) {
    try {
      const params = new URLSearchParams();

      params.append("page", page);
      params.append("limit", 5);

      if (filters.from?.trim()) {
        params.append("from", filters.from.trim());
      }
      if (filters.to?.trim()) {
        params.append("to", filters.to.trim());
      }
      if (filters.date) {
        params.append(
          "date",
          new Date(filters.date).toISOString().split("T")[0]
        );
      }
      if (filters.seats) {
        params.append("seats", filters.seats);
      }

      console.log("Searching with filters:", Object.fromEntries(params));
      const response = await api.get(`${ENDPOINTS.RIDES.SEARCH}?${params}`);

      if (response.data && response.data.success) {
        const rides = response.data.data.map((ride) => {
          this.updateLocalDriverData(ride);
          return {
            ...ride,
            features: this.getFeatures(ride.preferences),
          };
        });
        return {
          data: rides,
          currentPage: page,
          totalPages: Math.ceil(response.data.count / 10),
          pagination: response.data.pagination,
        };
      }

      return {
        data: [],
        currentPage: 1,
        totalPages: 1,
        pagination: {},
      };
    } catch (error) {
      console.error("Search rides error:", error);
      throw this.handleError(error);
    }
  }

  getFeatures(preferences) {
    const features = [];
    if (preferences) {
      if (preferences.smoking === false) features.push("Non-fumeur");
      if (preferences.music === true) features.push("Musique");
      if (preferences.pets === true) features.push("Animaux autorisés");
    }
    return features;
  }

  async bookRide(rideId, seats = 1) {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Veuillez vous connecter pour réserver un trajet");
      }

      const response = await api.post(
        ENDPOINTS.RIDES.BOOK(rideId),
        {
          seats,
          status: "pending",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async cancelBooking(rideId) {
    const response = await axios.delete(`${API_URL}/rides/${rideId}/book`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  }

  async getMyTrips() {
    try {
      const response = await axios.get(`${API_URL}/rides/my-bookings`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data?.data) {
        response.data.data.forEach((trip) => {
          this.updateLocalDriverData(trip);
        });
      }

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getTripDetails(rideId) {
    try {
      const response = await axios.get(`${API_URL}/rides/${rideId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data?.data) {
        this.updateLocalDriverData(response.data.data);
      }

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async rateTrip(tripId, rating) {
    try {
      const response = await axios.post(
        `${API_URL}/rides/${tripId}/rate`,
        {
          rating,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getReviews(tripId) {
    try {
      const response = await axios.get(`${API_URL}/reviews/trip/${tripId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response?.status === 401) {
      return "Veuillez vous reconnecter pour réserver ce trajet";
    }
    if (error.response?.data?.error) {
      return error.response.data.error;
    }
    return error.message || "Une erreur est survenue lors de la réservation";
  }
}

export default new TripService();
