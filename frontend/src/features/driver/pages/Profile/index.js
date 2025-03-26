import React, { useState, useEffect } from "react";
import DriverService from "../../services/driverService";
import { toast } from "react-toastify";
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
  phoneNumber: Yup.string()
    .nullable()
    .matches(/^[0-9+\s-]*$/, "Format de téléphone invalide"),
  carModel: Yup.string()
    .nullable()
    .min(2, "Le modèle doit contenir au moins 2 caractères"),
  carYear: Yup.number()
    .nullable()
    .min(1990, "L'année doit être supérieure à 1990")
    .max(new Date().getFullYear(), "L'année ne peut pas être dans le futur")
    .typeError("L'année doit être un nombre"),
  licensePlate: Yup.string()
    .nullable()
    .min(2, "La plaque d'immatriculation doit contenir au moins 2 caractères")
    .max(10, "La plaque d'immatriculation ne peut pas dépasser 10 caractères"),
});

const DriverProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = React.createRef();

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const response = await DriverService.getDriverProfile();
      setUserData(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error loading profile:", error);
      setLoading(false);
      toast.error("Erreur lors du chargement du profil conducteur");
    }
  };

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
      const formattedValues = {
        ...values,
        carYear: parseInt(values.carYear),
      };

      await DriverService.updateDriverProfile(formattedValues);

      if (selectedImage) {
        const formData = new FormData();
        formData.append("photo", selectedImage);
        await DriverService.uploadProfilePhoto(formData);
      }

      await loadUserProfile();
      toast.success("Profil conducteur mis à jour avec succès");
    } catch (error) {
      console.error("Erreur de mise à jour:", error);
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(`Erreur: ${errorMessage}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        {/* Profil Card */}
        <div className="rounded-lg bg-white shadow">
          <div className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="h-24 w-24 rounded-full overflow-hidden">
                  <img
                    src={
                      imagePreview ||
                      userData?.avatarUrl ||
                      "/images/default-avatar.png"
                    }
                    alt="Profile"
                    className="h-full w-full object-cover"
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
                </button>
              </div>

              <div className="text-center">
                <h2 className="text-xl font-bold">
                  {userData?.firstName} {userData?.lastName}
                </h2>
                <p className="text-sm text-gray-500">
                  Conducteur depuis{" "}
                  {new Date(userData?.createdAt).toLocaleDateString("fr-FR", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <div className="mt-2 flex justify-center space-x-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">
                      {userData?.stats?.totalTrips || 0}
                    </p>
                    <p className="text-sm text-gray-500">Trajets</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">
                      {userData?.stats?.rating || 0}/5
                    </p>
                    <p className="text-sm text-gray-500">Note</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Formulaire principal */}
        <div className="space-y-6">
          <div className="rounded-lg bg-white shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">
                Informations du conducteur
              </h2>
              <p className="text-sm text-gray-500">
                Mettez à jour vos informations personnelles et votre véhicule
              </p>
            </div>
            <div className="p-6">
              <Formik
                initialValues={{
                  firstName: userData?.firstName || "",
                  lastName: userData?.lastName || "",
                  email: userData?.email || "",
                  phoneNumber: userData?.phoneNumber || "",
                  carModel: userData?.driverInfo?.carModel || "",
                  carYear: userData?.driverInfo?.carYear || "",
                  licensePlate: userData?.driverInfo?.licensePlate || "",
                }}
                validationSchema={ProfileValidationSchema}
                onSubmit={handleProfileUpdate}
                enableReinitialize={true}
              >
                {({ errors, touched, handleSubmit, isSubmitting, values }) => {
                  console.log("Valeurs actuelles du formulaire:", values);
                  console.log("Données utilisateur:", userData);
                  return (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid gap-6 md:grid-cols-2">
                        <div>
                          <label
                            htmlFor="firstName"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Prénom
                          </label>
                          <Field
                            name="firstName"
                            type="text"
                            className={`mt-1 block w-full rounded-md border ${
                              errors.firstName && touched.firstName
                                ? "border-red-500"
                                : "border-gray-300"
                            } px-3 py-2`}
                          />
                          {errors.firstName && touched.firstName && (
                            <p className="mt-1 text-sm text-red-500">
                              {errors.firstName}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="lastName"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Nom
                          </label>
                          <Field
                            name="lastName"
                            type="text"
                            className={`mt-1 block w-full rounded-md border ${
                              errors.lastName && touched.lastName
                                ? "border-red-500"
                                : "border-gray-300"
                            } px-3 py-2`}
                          />
                          {errors.lastName && touched.lastName && (
                            <p className="mt-1 text-sm text-red-500">
                              {errors.lastName}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Email
                        </label>
                        <Field
                          name="email"
                          type="email"
                          className={`mt-1 block w-full rounded-md border ${
                            errors.email && touched.email
                              ? "border-red-500"
                              : "border-gray-300"
                          } px-3 py-2`}
                        />
                        {errors.email && touched.email && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.email}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="phoneNumber"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Téléphone
                        </label>
                        <Field
                          name="phoneNumber"
                          type="text"
                          className={`mt-1 block w-full rounded-md border ${
                            errors.phoneNumber && touched.phoneNumber
                              ? "border-red-500"
                              : "border-gray-300"
                          } px-3 py-2`}
                        />
                        {errors.phoneNumber && touched.phoneNumber && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.phoneNumber}
                          </p>
                        )}
                      </div>

                      <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-medium text-gray-900">
                          Informations du véhicule
                        </h3>

                        <div className="mt-6 grid gap-6 md:grid-cols-2">
                          <div>
                            <label
                              htmlFor="carModel"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Modèle du véhicule
                            </label>
                            <Field
                              name="carModel"
                              type="text"
                              className={`mt-1 block w-full rounded-md border ${
                                errors.carModel && touched.carModel
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } px-3 py-2`}
                            />
                            {errors.carModel && touched.carModel && (
                              <p className="mt-1 text-sm text-red-500">
                                {errors.carModel}
                              </p>
                            )}
                          </div>

                          <div>
                            <label
                              htmlFor="carYear"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Année du véhicule
                            </label>
                            <Field
                              name="carYear"
                              type="number"
                              className={`mt-1 block w-full rounded-md border ${
                                errors.carYear && touched.carYear
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } px-3 py-2`}
                            />
                            {errors.carYear && touched.carYear && (
                              <p className="mt-1 text-sm text-red-500">
                                {errors.carYear}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="mt-6">
                          <label
                            htmlFor="licensePlate"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Plaque d'immatriculation
                          </label>
                          <Field
                            name="licensePlate"
                            type="text"
                            className={`mt-1 block w-full rounded-md border ${
                              errors.licensePlate && touched.licensePlate
                                ? "border-red-500"
                                : "border-gray-300"
                            } px-3 py-2`}
                          />
                          {errors.licensePlate && touched.licensePlate && (
                            <p className="mt-1 text-sm text-red-500">
                              {errors.licensePlate}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="inline-flex justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        >
                          {isSubmitting
                            ? "Enregistrement..."
                            : "Enregistrer les modifications"}
                        </button>
                      </div>
                    </form>
                  );
                }}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverProfile;
