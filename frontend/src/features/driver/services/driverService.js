import api from "../../../config/axios";
import UserService from "../../user/services/userService";

class DriverService extends UserService {
  static async updateDriverProfile(driverData) {
    try {
     

      const baseResponse = await api.put("/api/v1/users/me", {
        firstName: driverData.firstName,
        lastName: driverData.lastName,
        email: driverData.email,
        phoneNumber: driverData.phoneNumber,
        role: "driver",
      });

      const driverResponse = await api.put("/api/v1/users/me/driver", {
        carModel: driverData.carModel,
        carYear: driverData.carYear ? parseInt(driverData.carYear) : undefined,
        licensePlate: driverData.licensePlate,
      });

      console.log("Réponse base:", baseResponse);
      console.log("Réponse conducteur:", driverResponse);

      const updatedProfile = await this.getDriverProfile();
      return {
        success: true,
        message: "Profil conducteur mis à jour avec succès",
        data: updatedProfile,
      };
    } catch (error) {
      console.error("Erreur de mise à jour du profil conducteur:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw error;
    }
  }

  static async getDriverProfile() {
    try {
      const response = await api.get("/api/v1/users/me");
      console.log("Driver API Response:", response);
      return response;
    } catch (error) {
      console.error("Driver API Error:", error);
      throw error;
    }
  }

  static async uploadDriverDocuments(formData) {
    try {
      console.log("Uploading driver documents...");

      const response = await api.post("/api/v1/users/me/documents", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Documents upload response:", response);
      return response;
    } catch (error) {
      console.error("Documents upload error:", error);
      throw error;
    }
  }

  static async getDriverStats() {
    try {
      const response = await api.get("/api/v1/users/me/stats");
      return response;
    } catch (error) {
      console.error("Error fetching driver stats:", error);
      throw error;
    }
  }

  static async updateDriverAvailability(availability) {
    try {
      const response = await api.put("/api/v1/users/me/availability", {
        availability,
      });
      return response;
    } catch (error) {
      console.error("Error updating driver availability:", error);
      throw error;
    }
  }

  static async getDriverTrips(filters = {}) {
    try {
      const response = await api.get("/api/v1/users/me/trips", {
        params: filters,
      });
      return response;
    } catch (error) {
      console.error("Error fetching driver trips:", error);
      throw error;
    }
  }

  static cleanDriverData(data) {
    const cleaned = super.cleanProfileData(data);

    const driverFields = ["carModel", "carYear", "licensePlate"];
    driverFields.forEach((field) => {
      if (!cleaned[field]) {
        console.warn(`Missing driver field: ${field}`);
      }
    });

    return cleaned;
  }

  static handleDriverError(error) {
    if (error.response) {
      const message =
        error.response.data.message ||
        "Une erreur est survenue avec le profil conducteur";
      throw new Error(message);
    } else if (error.request) {
      throw new Error(
        "Impossible de contacter le serveur pour le profil conducteur"
      );
    } else {
      throw new Error("Erreur de configuration de la requête conducteur");
    }
  }
}

export default DriverService;
