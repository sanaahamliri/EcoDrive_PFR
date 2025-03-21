import api from "../../../config/api";
import { ENDPOINTS } from "../../../constants/endpoints";
import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

class TripService {
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
      if (filters.maxPrice) {
        params.append("maxPrice", filters.maxPrice);
      }

      // Préférences
      if (filters.preferences?.length > 0) {
        const preferencesMap = {
          "non-fumeur": "smoking",
          musique: "music",
          animaux: "pets",
        };

        const apiPreferences = [];

        filters.preferences.forEach((pref) => {
          if (preferencesMap[pref]) {
            const apiPrefName = preferencesMap[pref];
            const value = pref === "non-fumeur" ? "false" : "true";
            params.append(`preferences.${apiPrefName}`, value);
          }
        });
      }

      // Heure de départ
      if (filters.departureTime) {
        const timeRanges = {
          morning: { start: "06:00", end: "12:00" },
          afternoon: { start: "12:00", end: "18:00" },
          evening: { start: "18:00", end: "00:00" },
        };

        if (timeRanges[filters.departureTime]) {
          const range = timeRanges[filters.departureTime];
          params.append("departureTimeStart", range.start);
          params.append("departureTimeEnd", range.end);
        }
      }

      // Note conducteur
      if (filters.driverRating) {
        params.append("driverRating", filters.driverRating);
      }

      console.log("Searching with filters:", Object.fromEntries(params));
      const response = await api.get(`${ENDPOINTS.RIDES.SEARCH}?${params}`);

      if (response.data && response.data.success) {
        const rides = response.data.data.map((ride) => {
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
    const response = await axios.get(`${API_URL}/rides/my-bookings`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  }

  async getTripDetails(rideId) {
    const response = await axios.get(`${API_URL}/rides/${rideId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  }

  async rateTrip(tripId, rating, comment) {
    try {
      const response = await axios.post(
        `${API_URL}/rides/${tripId}/rate`,
        {
          rating,
          comment,
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

  static getReviews(tripId) {
    return axios.get(`/api/v1/trips/${tripId}/reviews`);
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
