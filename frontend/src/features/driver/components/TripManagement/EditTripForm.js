"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  Calendar,
  MapPin,
  Music,
  PawPrint,
  CigaretteIcon as Smoking,
  Users,
  X,
} from "lucide-react";

const EditTripForm = ({ trip, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState({
    departure: {
      city: "",
      address: "",
    },
    destination: {
      city: "",
      address: "",
    },
    departureTime: "",
    price: "",
    availableSeats: 1,
    preferences: {
      smoking: false,
      music: false,
      pets: false,
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (trip) {
      setFormData({
        departure: trip.departure,
        destination: trip.destination,
        departureTime: new Date(trip.departureTime).toISOString().slice(0, 16),
        price: trip.price,
        availableSeats: trip.availableSeats,
        preferences: trip.preferences,
      });
    }
  }, [trip]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes("preferences.")) {
      const preference = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [preference]: checked,
        },
      }));
    } else if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "number" ? Number(value) : value,
      }));
    }
  };

  const handlePreferenceChange = (preference, checked) => {
    setFormData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [preference]: checked,
      },
    }));
  };

  const handleSelectChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      availableSeats: Number(e.target.value),
    }));
  };

  const validateForm = () => {
    const now = new Date();
    const departureTime = new Date(formData.departureTime);
    const hoursUntilDeparture = (departureTime - now) / (1000 * 60 * 60);

    if (hoursUntilDeparture < 24) {
      toast.error(
        "Impossible de modifier l'heure de départ à moins de 24h du départ"
      );
      return false;
    }

    if (formData.price < 0) {
      toast.error("Le prix ne peut pas être négatif");
      return false;
    }

    if (formData.availableSeats < 1 || formData.availableSeats > 8) {
      toast.error("Le nombre de places doit être compris entre 1 et 8");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      await onUpdate(formData);
      toast.success("Trajet modifié avec succès !");
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Une erreur est survenue lors de la modification du trajet";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Modifier le trajet</h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium flex items-center gap-2 text-gray-500">
                  <MapPin className="h-4 w-4" />
                  Départ
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1.5">
                    <label
                      htmlFor="departure.city"
                      className="text-sm font-medium"
                    >
                      Ville
                    </label>
                    <input
                      id="departure.city"
                      name="departure.city"
                      value={formData.departure.city}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <label
                      htmlFor="departure.address"
                      className="text-sm font-medium"
                    >
                      Adresse
                    </label>
                    <input
                      id="departure.address"
                      name="departure.address"
                      value={formData.departure.address}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <hr className="border-gray-200" />

              <div className="space-y-2">
                <h3 className="text-sm font-medium flex items-center gap-2 text-gray-500">
                  <MapPin className="h-4 w-4" />
                  Destination
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1.5">
                    <label
                      htmlFor="destination.city"
                      className="text-sm font-medium"
                    >
                      Ville
                    </label>
                    <input
                      id="destination.city"
                      name="destination.city"
                      value={formData.destination.city}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <label
                      htmlFor="destination.address"
                      className="text-sm font-medium"
                    >
                      Adresse
                    </label>
                    <input
                      id="destination.address"
                      name="destination.address"
                      value={formData.destination.address}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <hr className="border-gray-200" />

              <div className="grid grid-cols-3 gap-3">
                <div className="grid gap-1.5">
                  <label
                    htmlFor="departureTime"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <Calendar className="h-4 w-4" />
                    Date et heure
                  </label>
                  <input
                    id="departureTime"
                    name="departureTime"
                    type="datetime-local"
                    value={formData.departureTime}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid gap-1.5">
                  <label htmlFor="price" className="text-sm font-medium">
                    Prix (DH)
                  </label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid gap-1.5">
                  <label
                    htmlFor="availableSeats"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <Users className="h-4 w-4" />
                    Places
                  </label>
                  <select
                    id="availableSeats"
                    value={formData.availableSeats}
                    onChange={handleSelectChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <hr className="border-gray-200" />

              <div className="space-y-3">
                <h3 className="text-sm font-medium">Préférences</h3>
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex flex-col items-center gap-1.5 p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <Smoking className="h-5 w-5 text-gray-500" />
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="smoking"
                        checked={formData.preferences.smoking}
                        onChange={(e) =>
                          handlePreferenceChange("smoking", e.target.checked)
                        }
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="smoking" className="text-xs font-medium">
                        Fumeur
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-1.5 p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <Music className="h-5 w-5 text-gray-500" />
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="music"
                        checked={formData.preferences.music}
                        onChange={(e) =>
                          handlePreferenceChange("music", e.target.checked)
                        }
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="music" className="text-xs font-medium">
                        Musique
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-1.5 p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <PawPrint className="h-5 w-5 text-gray-500" />
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="pets"
                        checked={formData.preferences.pets}
                        onChange={(e) =>
                          handlePreferenceChange("pets", e.target.checked)
                        }
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="pets" className="text-xs font-medium">
                        Animaux
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Modification..." : "Modifier"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTripForm;
