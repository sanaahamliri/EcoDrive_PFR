import React, { useState, useEffect, useRef } from "react";
import UserService from "../services/userService";
import { toast } from "react-toastify";
import { API_URL } from "../../../config/constants";
import Avatar from "../../../components/Avatar";
import * as Yup from "yup";
import { Formik, Field } from "formik";

const ProfileValidationSchema = Yup.object().shape({
  firstName: Yup.string()
    .required("Le prénom est requis")
    .min(2, "Le prénom doit contenir au moins 2 caractères")
    .max(50, "Le prénom ne peut pas dépasser 50 caractères"),
  lastName: Yup.string()
    .required("Le nom est requis")
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom ne peut pas dépasser 50 caractères"),
  email: Yup.string()
    .required("L'email est requis")
    .email("Format d'email invalide"),
  phone: Yup.string()
    .nullable()
    .matches(/^[0-9+\s-]*$/, "Format de téléphone invalide"),
});

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState({
    language: "fr",
    notifications: {
      email: true,
      push: true,
    },
    travelPreferences: {
      smoking: false,
      music: true,
      pets: false,
      conversation: "moderate",
    },
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);


  useEffect(() => {
    loadUserProfile();
  }, []);

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = async (values) => {
    try {
      console.log("Valeurs à envoyer:", values);

      const profileResponse = await UserService.updateProfile(values);
      console.log("Réponse mise à jour profil:", profileResponse);

      if (selectedImage) {
        const formData = new FormData();
        formData.append("photo", selectedImage);

        const photoResponse = await UserService.uploadProfilePhoto(formData);
        console.log("Réponse upload photo:", photoResponse);
      }

      await loadUserProfile();

      toast.success("Profil mis à jour avec succès");
    } catch (error) {
      console.error("Erreur de mise à jour:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      const errorMessage = error.response?.data?.message || error.message;
      toast.error(`Erreur: ${errorMessage}`);
    }
  };

  const handlePreferencesUpdate = async () => {
    try {
      const preferencesData = {
        language: "fr",
        notifications: {
          email: true,
          push: true,
        },
        travelPreferences: {
          smoking: preferences.smoking,
          music: preferences.music,
          pets: preferences.pets,
          conversation: preferences.conversation,
        },
      };

      await UserService.updatePreferences(preferencesData);
      toast.success("Préférences mises à jour avec succès");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour des préférences");
      console.error("Error updating preferences:", error);
    }
  };

  const getInitials = (firstName, lastName) => {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : "";
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";
    return `${firstInitial}${lastInitial}`;
  };

  const getAvatarColor = (name) => {
    const colors = [
      "bg-blue-600",
      "bg-green-600",
      "bg-purple-600",
      "bg-pink-600",
      "bg-yellow-600",
      "bg-red-600",
      "bg-indigo-600",
    ];

    if (!name) return colors[0];

    const charCodes = name.split("").map((char) => char.charCodeAt(0));
    const sum = charCodes.reduce((acc, curr) => acc + curr, 0);
    return colors[sum % colors.length];
  };

  const isDefaultAvatar = (avatar) => {
    return !avatar;
  };

  const checkUploads = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v1/users/check-uploads`);
      const data = await response.json();
      console.log("Uploads check:", data);
    } catch (error) {
      console.error("Error checking uploads:", error);
    }
  };

  const handlePhotoUpload = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;

      console.log("File to upload:", {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified,
      });

      const formData = new FormData();
      formData.append("photo", file);

      toast.info("Upload en cours...");

      const response = await UserService.uploadProfilePhoto(formData);
      console.log("Upload response in component:", response);

      if (response.data.success) {
        console.log("New avatar URL:", response.data.data.avatarUrl);

        setUserData((prev) => ({
          ...prev,
          avatarUrl: response.data.data.avatarUrl,
        }));

        toast.success("Photo de profil mise à jour avec succès");
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
      toast.error(
        error.response?.data?.message ||
          "Erreur lors du téléchargement de la photo"
      );
    }
  };

  const getPreferenceLabel = (key) => {
    const labels = {
      smoking: "Non-fumeur",
      music: "Musique",
      pets: "Animaux",
      conversation: "Conversation",
      airConditioning: "Climatisation",
    };
    return labels[key] || key;
  };

  const getPreferenceDescription = (key) => {
    const descriptions = {
      smoking: "Préférence pour les trajets sans fumée",
      music: "Préférence pour la musique pendant le trajet",
      pets: "Accepte les animaux pendant le trajet",
      conversation: "Préférence pour les conversations pendant le trajet",
      airConditioning: "Préférence pour les véhicules climatisés",
    };
    return descriptions[key] || "";
  };

  const handlePreferenceChange = (preference, value) => {
    setPreferences((prev) => ({
      ...prev,
      [preference]: value,
    }));
  };

  const loadUserProfile = async () => {
    try {
      console.log("Loading user profile...");
      const response = await UserService.getProfile();
      console.log("Profile loaded:", response.data);

      setUserData(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error loading profile:", error);
      setLoading(false);
      toast.error("Erreur lors du chargement du profil");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-600 mb-4">
          Impossible de charger les données du profil
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Profil</h1>
        <button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          Paramètres
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        <div className="rounded-lg bg-white shadow">
          <div className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="h-24 w-24 rounded-full overflow-hidden">
                  <img
                    src={
                      imagePreview ||
                      userData.avatarUrl ||
                      "/images/default-avatar.png"
                    }
                    alt="Profile"
                    className="profile-avatar h-full w-full object-cover"
                  />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  style={{ display: "none" }}
                  ref={fileInputRef}
                />
                <button
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full border border-gray-300 bg-white p-1 shadow-sm hover:bg-gray-50"
                  onClick={() => fileInputRef.current.click()}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-full w-full text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="sr-only">Changer la photo</span>
                </button>
              </div>

              <div className="text-center">
                <h2 className="text-xl font-bold">
                  {userData?.firstName} {userData?.lastName}
                </h2>
                <p className="text-sm text-gray-500">
                  {userData?.role === "driver" ? "Conducteur" : "Passager"}{" "}
                  depuis{" "}
                  {new Date(userData?.createdAt).toLocaleDateString("fr-FR", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="pt-4">
            {activeTab === "personal" && (
              <div className="rounded-lg bg-white shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold">
                    Informations personnelles
                  </h2>
                  <p className="text-sm text-gray-500">
                    Mettez à jour vos informations personnelles
                  </p>
                </div>
                <div className="p-6 space-y-4">
                  <Formik
                    initialValues={{
                      firstName: userData.firstName || "",
                      lastName: userData.lastName || "",
                      email: userData.email || "",
                      phoneNumber: userData.phoneNumber || "",
                    }}
                    validationSchema={ProfileValidationSchema}
                    onSubmit={handleProfileUpdate}
                  >
                    {({ errors, touched, handleSubmit, isSubmitting }) => (
                      <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <label
                              htmlFor="firstName"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Prénom
                            </label>
                            <div className="relative">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="absolute left-3 top-3 h-4 w-4 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                              </svg>
                              <Field
                                id="firstName"
                                name="firstName"
                                type="text"
                                placeholder="Prénom"
                                className={`w-full rounded-md border ${
                                  errors.firstName && touched.firstName
                                    ? "border-red-500"
                                    : "border-gray-300"
                                } pl-9 py-2`}
                              />
                            </div>
                            {errors.firstName && touched.firstName && (
                              <div className="text-red-500 text-sm mt-1">
                                {errors.firstName}
                              </div>
                            )}
                          </div>

                          <div className="space-y-2">
                            <label
                              htmlFor="lastName"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Nom
                            </label>
                            <div className="relative">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="absolute left-3 top-3 h-4 w-4 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                              </svg>
                              <Field
                                id="lastName"
                                name="lastName"
                                type="text"
                                placeholder="Nom"
                                className={`w-full rounded-md border ${
                                  errors.lastName && touched.lastName
                                    ? "border-red-500"
                                    : "border-gray-300"
                                } pl-9 py-2`}
                              />
                            </div>
                            {errors.lastName && touched.lastName && (
                              <div className="text-red-500 text-sm mt-1">
                                {errors.lastName}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Email
                          </label>
                          <div className="relative">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="absolute left-3 top-3 h-4 w-4 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                            <Field
                              id="email"
                              name="email"
                              type="email"
                              placeholder="Email"
                              className={`w-full rounded-md border ${
                                errors.email && touched.email
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } pl-9 py-2`}
                            />
                          </div>
                          {errors.email && touched.email && (
                            <div className="text-red-500 text-sm mt-1">
                              {errors.email}
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label
                            htmlFor="phoneNumber"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Téléphone
                          </label>
                          <div className="relative">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="absolute left-3 top-3 h-4 w-4 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                              />
                            </svg>
                            <Field
                              id="phoneNumber"
                              name="phoneNumber"
                              type="text"
                              placeholder="Téléphone"
                              className={`w-full rounded-md border ${
                                errors.phoneNumber && touched.phoneNumber
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } pl-9 py-2`}
                            />
                          </div>
                          {errors.phoneNumber && touched.phoneNumber && (
                            <div className="text-red-500 text-sm mt-1">
                              {errors.phoneNumber}
                            </div>
                          )}
                        </div>

                        <div className="pt-4">
                          <button
                            type="submit"
                            className="inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? "Mise à jour..." : "Mettre à jour"}
                          </button>
                        </div>
                      </form>
                    )}
                  </Formik>
                </div>
              </div>
            )}

            {activeTab === "preferences" && (
              <div className="rounded-lg bg-white shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold">
                    Préférences de trajet
                  </h2>
                  <p className="text-sm text-gray-500">
                    Personnalisez vos préférences pour les trajets
                  </p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="space-y-4">
                    {Object.entries(preferences).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between"
                      >
                        <div className="space-y-0.5">
                          <label className="block text-sm font-medium text-gray-700">
                            {getPreferenceLabel(key)}
                          </label>
                          <p className="text-sm text-gray-500">
                            {getPreferenceDescription(key)}
                          </p>
                        </div>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input
                            type="checkbox"
                            id={key}
                            className="sr-only"
                            checked={value}
                            onChange={(e) =>
                              handlePreferenceChange(key, e.target.checked)
                            }
                          />
                          <div className="block h-6 bg-gray-300 rounded-full w-10"></div>
                          <div
                            className={`dot absolute left-1 top-1 h-4 w-4 bg-white rounded-full transition ${
                              value ? "translate-x-4" : ""
                            }`}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={handlePreferencesUpdate}
                      className="inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700"
                    >
                      Enregistrer les préférences
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "payment" && (
              <div className="rounded-lg bg-white shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold">
                    Méthodes de paiement
                  </h2>
                  <p className="text-sm text-gray-500">
                    Gérez vos méthodes de paiement
                  </p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="rounded-md bg-green-100 p-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-green-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                            />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium">
                            Visa se terminant par 4242
                          </div>
                          <div className="text-sm text-gray-500">
                            Expire le 12/25
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                          Modifier
                        </button>
                        <button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>

                  <button className="inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-2 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Ajouter une nouvelle méthode de paiement
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
