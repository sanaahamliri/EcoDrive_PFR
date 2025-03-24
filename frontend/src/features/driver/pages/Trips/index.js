import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DriverRideService from "../../services/rideService";
import CreateTripForm from "../../components/TripManagement/CreateTripForm";
import TripList from "../../components/TripManagement/TripList";
import EditTripForm from "../../components/TripManagement/EditTripForm";
import DriverService from "../../services/driverService";
import { useNavigate } from "react-router-dom";

const ManageTrips = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingTrip, setEditingTrip] = useState(null);
  const [profileStatus, setProfileStatus] = useState({
    isComplete: false,
    missingFields: [],
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadTrips();
    checkProfileCompletion();
  }, []);

  const checkProfileCompletion = async () => {
    try {
      const response = await DriverService.getDriverProfile();
      const userData = response.data.data;

      const missingFields = [];

      if (!userData.firstName) missingFields.push("prénom");
      if (!userData.lastName) missingFields.push("nom");
      if (!userData.email) missingFields.push("email");
      if (!userData.phoneNumber) missingFields.push("numéro de téléphone");
      if (!userData.driverInfo?.carModel)
        missingFields.push("modèle du véhicule");
      if (!userData.driverInfo?.carYear)
        missingFields.push("année du véhicule");
      if (!userData.driverInfo?.licensePlate)
        missingFields.push("plaque d'immatriculation");

      setProfileStatus({
        isComplete: missingFields.length === 0,
        missingFields,
      });
    } catch (err) {
      console.error("Erreur lors de la vérification du profil:", err);
      setProfileStatus({
        isComplete: false,
        missingFields: ["informations du profil"],
      });
    }
  };

  const handleCreateClick = () => {
    if (!profileStatus.isComplete) {
      const missingFieldsList = profileStatus.missingFields.join(", ");
      setError(
        `Pour créer un trajet, veuillez d'abord compléter votre profil conducteur. Informations manquantes : ${missingFieldsList}.`
      );
      // Rediriger vers la page de profil après 3 secondes
      setTimeout(() => {
        navigate("/driver/profile");
      }, 3000);
      return;
    }
    setShowCreateForm(true);
  };

  const loadTrips = async () => {
    try {
      setLoading(true);
      const response = await DriverRideService.getMyRides();
      setTrips(response.data || []);
    } catch (err) {
      setError(err.message || "Erreur lors du chargement des trajets");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    setSuccessMessage("Trajet créé avec succès !");
    loadTrips();
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleDelete = async (tripId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce trajet ?")) {
      try {
        await DriverRideService.deleteRide(tripId);
        setSuccessMessage("Trajet supprimé avec succès !");
        loadTrips();
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (err) {
        setError("Erreur lors de la suppression du trajet");
      }
    }
  };

  const handleUpdate = async (tripData) => {
    try {
      await DriverRideService.updateRide(editingTrip._id, tripData);
      setSuccessMessage("Trajet modifié avec succès !");
      setEditingTrip(null);
      loadTrips();
    } catch (err) {
      setError(err.message || "Erreur lors de la modification du trajet");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ToastContainer />

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Gérer mes trajets</h1>
        <button
          onClick={handleCreateClick}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center"
        >
          <span className="text-xl mr-2">📅</span>
          Proposer un trajet
        </button>
      </div>

      {/* Messages de succès et d'erreur */}
      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded relative">
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
          {!profileStatus.isComplete && (
            <span className="block mt-2 text-sm">
              Vous serez redirigé vers votre page de profil dans quelques
              secondes...
            </span>
          )}
        </div>
      )}

      {/* Liste des trajets */}
      <div className="bg-white rounded-lg shadow">
        {loading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          </div>
        ) : (
          <TripList
            trips={trips}
            onDelete={handleDelete}
            onUpdate={(trip) => setEditingTrip(trip)}
          />
        )}
      </div>

      {/* Modals */}
      {showCreateForm && (
        <CreateTripForm
          onSuccess={handleCreateSuccess}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {editingTrip && (
        <EditTripForm
          trip={editingTrip}
          onUpdate={handleUpdate}
          onCancel={() => setEditingTrip(null)}
        />
      )}
    </div>
  );
};

export default ManageTrips;
