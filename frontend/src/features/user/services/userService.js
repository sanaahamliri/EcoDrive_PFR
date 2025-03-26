import api from "../../../config/axios";
import AuthService from "../../../services/authService";

class UserService {
  static async getProfile() {
    try {
      const response = await api.get("/api/v1/users/me");
      console.log("API Response in service:", response);
      return response;
    } catch (error) {
      console.error("API Error in service:", error);
      throw error;
    }
  }

  static async updateProfile(userData) {
    try {
      console.log("Données envoyées au serveur:", userData);

      const response = await api.put("/api/v1/users/me", userData);
      return response;
    } catch (error) {
      console.error("Update profile error details:", {
        data: error.response?.data,
        status: error.response?.status,
        message: error.response?.data?.message,
      });
      throw error;
    }
  }

  static cleanProfileData(data) {
    const cleaned = { ...data };

    Object.keys(cleaned).forEach((key) => {
      if (cleaned[key] === undefined || cleaned[key] === "") {
        delete cleaned[key];
      }
    });

    const requiredFields = ["firstName", "lastName", "email"];
    requiredFields.forEach((field) => {
      if (!cleaned[field]) {
        console.warn(`Missing required field: ${field}`);
      }
    });

    return cleaned;
  }

  static async updatePreferences(preferences) {
    try {
      const response = await api.put("/api/users/preferences", preferences);
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async uploadProfilePhoto(formData) {
    try {
      console.log("Uploading photo with formData:", {
        hasData: !!formData,
        isFormData: formData instanceof FormData,
      });

      const response = await api.put("/api/v1/users/me/photo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Upload response in service:", response);

      if (response.data?.success && response.data?.data?.avatar) {
        const currentUser = AuthService.getUser();
        if (currentUser) {
          AuthService.updateUser({
            ...currentUser,
            avatar: response.data.data.avatar,
          });
        }
      }

      return response;
    } catch (error) {
      console.error("Upload error in service:", error);
      throw error;
    }
  }

  handleError(error) {
    if (error.response) {
      const message = error.response.data.message || "Une erreur est survenue";
      throw new Error(message);
    } else if (error.request) {
      throw new Error("Impossible de contacter le serveur");
    } else {
      throw new Error("Erreur de configuration de la requête");
    }
  }
}

export default UserService;
