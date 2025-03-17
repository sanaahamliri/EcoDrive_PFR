import api from "../../../config/api"
import { ENDPOINTS } from "../../../constants/endpoints"

class TripService {
  async searchRides(filters = {}) {
    try {
      const params = new URLSearchParams()

      // Nettoyage et validation des filtres avant envoi
      if (filters.from?.trim()) {
        params.append("from", filters.from.trim())
      }
      if (filters.to?.trim()) {
        params.append("to", filters.to.trim())
      }
      if (filters.date) {
        params.append("date", new Date(filters.date).toISOString().split("T")[0])
      }
      if (filters.seats) {
        params.append("seats", filters.seats)
      }
      if (filters.maxPrice) {
        params.append("maxPrice", filters.maxPrice)
      }

      // Préférences
      if (filters.preferences?.length > 0) {
        // Convertir les préférences en format attendu par l'API
        const preferencesMap = {
          "non-fumeur": "smoking",
          musique: "music",
          animaux: "pets",
        }

        const apiPreferences = []

        filters.preferences.forEach((pref) => {
          if (preferencesMap[pref]) {
            const apiPrefName = preferencesMap[pref]
            const value = pref === "non-fumeur" ? "false" : "true"
            params.append(`preferences.${apiPrefName}`, value)
          }
        })
      }

      // Heure de départ
      if (filters.departureTime) {
        const timeRanges = {
          morning: { start: "06:00", end: "12:00" },
          afternoon: { start: "12:00", end: "18:00" },
          evening: { start: "18:00", end: "00:00" },
        }

        if (timeRanges[filters.departureTime]) {
          const range = timeRanges[filters.departureTime]
          params.append("departureTimeStart", range.start)
          params.append("departureTimeEnd", range.end)
        }
      }

      // Note conducteur
      if (filters.driverRating) {
        params.append("driverRating", filters.driverRating)
      }

      console.log("Searching with filters:", Object.fromEntries(params))
      const response = await api.get(`${ENDPOINTS.RIDES.SEARCH}?${params}`)

      if (response.data && response.data.success) {
        // Traitement des données pour ajouter les features
        const rides = response.data.data.map((ride) => {
          return {
            ...ride,
            features: this.getFeatures(ride.preferences),
          }
        })
        return rides
      }

      return []
    } catch (error) {
      console.error("Search rides error:", error)
      throw this.handleError(error)
    }
  }

  getFeatures(preferences) {
    const features = []
    if (preferences) {
      if (preferences.smoking === false) features.push("Non-fumeur")
      if (preferences.music === true) features.push("Musique")
      if (preferences.pets === true) features.push("Animaux autorisés")
    }
    return features
  }

  async bookRide(rideId, seats = 1) {
    try {
      const response = await api.post(ENDPOINTS.RIDES.BOOK(rideId), {
        seats,
        status: "pending",
      })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async cancelBooking(rideId) {
    try {
      const response = await api.delete(ENDPOINTS.RIDES.CANCEL(rideId))
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  handleError(error) {
    if (error.response?.data?.error) {
      return error.response.data.error
    }
    return "Une erreur est survenue"
  }
}

export default new TripService()

