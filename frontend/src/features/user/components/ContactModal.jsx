import React from "react";
import Avatar from "../../../components/Avatar";

export default function ContactModal({ driver, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex items-center mb-4">
          <Avatar
            src={driver?.avatarUrl}
            size={64}
            alt={`${driver?.firstName} ${driver?.lastName}`}
          />
          <div className="ml-4">
            <h2 className="text-xl font-semibold">
              {driver?.firstName} {driver?.lastName}
            </h2>
            <p className="text-gray-600">Conducteur</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-700">Email</h3>
            <p className="text-gray-600">{driver?.email}</p>
          </div>
          {driver?.phoneNumber && (
            <div>
              <h3 className="font-medium text-gray-700">Téléphone</h3>
              <p className="text-gray-600">{driver.phoneNumber}</p>
            </div>
          )}
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
