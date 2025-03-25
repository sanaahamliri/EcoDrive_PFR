import React from "react";
import Avatar from "../../../components/Avatar";
import { Star, Phone, Mail, Car } from "lucide-react";

export default function ContactModal({ driver, onClose }) {
  if (!driver) {
    return null;
  }

  const driverName =
    `${driver.firstName || ""} ${driver.lastName || ""}`.trim();
  const driverEmail = driver.email || "Non disponible";
  const driverPhone = driver.phoneNumber || "Non disponible";
  const driverRating = driver.stats?.rating || 0;
  const carModel = driver.driverInfo?.carModel || "Non spécifié";
  const carYear = driver.driverInfo?.carYear || "Non spécifié";
  const licensePlate = driver.driverInfo?.licensePlate || "Non spécifié";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center mb-6">
          <Avatar src={driver?.avatar} size={80} alt={driverName} />
          <div className="ml-4">
            <h2 className="text-xl font-semibold">{driverName}</h2>
            <p className="text-gray-600">Conducteur</p>
            <div className="flex items-center mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(driverRating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="ml-2 text-sm font-medium">
                {driverRating || "Pas encore noté"}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Mail className="h-5 w-5 text-gray-500" />
            <div>
              <h3 className="font-medium text-gray-700">Email</h3>
              <p className="text-gray-600">{driverEmail}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Phone className="h-5 w-5 text-gray-500" />
            <div>
              <h3 className="font-medium text-gray-700">Téléphone</h3>
              <p className="text-gray-600">{driverPhone}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Car className="h-5 w-5 text-gray-500" />
            <div>
              <h3 className="font-medium text-gray-700">Véhicule</h3>
              <p className="text-gray-600">
                {carModel} - {carYear}
              </p>
              <p className="text-sm text-gray-500">{licensePlate}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
