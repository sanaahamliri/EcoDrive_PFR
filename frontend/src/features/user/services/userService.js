import axiosInstance from "../../../config/axios";

class UserService {
  async getProfile() {
    try {
      const response = await axiosInstance.get("/users/me");
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateProfile(userData) {
    try {
      const response = await axiosInstance.put("/users/me", userData);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updatePreferences(preferences) {
    try {
      const response = await axiosInstance.put(
        "/users/me/preferences",
        preferences
      );
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async uploadProfilePhoto(file) {
    try {
      const formData = new FormData();
      formData.append("photo", file);

      const response = await axiosInstance.put("/users/me/photo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      // Le serveur a répondu avec un status code hors de la plage 2xx
      const message = error.response.data.message || "Une erreur est survenue";
      throw new Error(message);
    } else if (error.request) {
      // La requête a été faite mais aucune réponse n'a été reçue
      throw new Error("Impossible de contacter le serveur");
    } else {
      // Une erreur s'est produite lors de la configuration de la requête
      throw new Error("Erreur de configuration de la requête");
    }
  }
}

export default new UserService();
