import React, { useState } from "react";
import axios from "axios";
import {
  FaTrash,
  FaExclamationTriangle,
  FaPlane,
  FaMapMarkerAlt,
  FaClock,
  FaCalendarAlt,
} from "react-icons/fa";
import { toast } from "sonner";
import { Flight } from "../../../types/flight";

interface DeleteFlightModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  flight: Flight | null;
}

const DeleteFlightModal: React.FC<DeleteFlightModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  flight,
}) => {
  const [confirmationFlightNumber, setConfirmationFlightNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!flight) return;

    // Validate confirmation flight number
    if (confirmationFlightNumber.trim().toLowerCase() !== flight.flight_number.toLowerCase()) {
      setError(
        "Flight number confirmation does not match. Please type the exact flight number."
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      await axios.delete(`http://127.0.0.1:8000/api/flight/${flight.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      toast.error("Flight deleted successfully");

      onSuccess();
      handleClose();
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to delete flight"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setConfirmationFlightNumber("");
    setError("");
    onClose();
  };

  const isConfirmationValid =
    confirmationFlightNumber.trim().toLowerCase() === flight?.flight_number.toLowerCase();

  if (!isOpen || !flight) return null;

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  };

  const departureDateTime = formatDateTime(flight.departure_time);
  const arrivalDateTime = formatDateTime(flight.arrival_time);

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md h-[90vh] overflow-y-auto">
        <div className="border-b px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <FaExclamationTriangle className="text-red-600 text-lg" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Delete Flight</h2>
              <p className="text-sm text-gray-600">
                This action cannot be undone
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Warning Message */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <FaExclamationTriangle className="text-red-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-red-800 mb-1">
                  Warning: Permanent Deletion
                </p>
                <p className="text-red-700">
                  You are about to permanently delete this flight. This action will:
                </p>
                <ul className="list-disc list-inside mt-2 text-red-700 space-y-1">
                  <li>Remove the flight from all schedules</li>
                  <li>Cancel any existing bookings</li>
                  <li>Delete all associated flight data</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Flight Details */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <h3 className="font-medium text-gray-900 flex items-center gap-2">
              <FaPlane className="text-blue-500" />
              Flight Details
            </h3>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Flight Number</p>
                <p className="font-medium text-gray-900">{flight.flight_number}</p>
              </div>
              <div>
                <p className="text-gray-600">Airline</p>
                <p className="font-medium text-gray-900">{flight.airline}</p>
              </div>
            </div>

            {/* Route Information */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-green-500" />
                <span className="font-medium text-gray-900">Route</span>
              </div>
              <div className="bg-white rounded-md p-3 border">
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <p className="font-medium text-gray-900">
                      {flight.departure_airport?.city_name || "N/A"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {flight.departure_airport?.country_name || "N/A"}
                    </p>
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <div className="border-t border-gray-300 flex-1"></div>
                    <FaPlane className="mx-2 text-gray-400" />
                    <div className="border-t border-gray-300 flex-1"></div>
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-gray-900">
                      {flight.arrival_airport?.city_name || "N/A"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {flight.arrival_airport?.country_name || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-md p-3 border">
                <div className="flex items-center gap-2 mb-2">
                  <FaCalendarAlt className="text-blue-500 text-sm" />
                  <span className="text-sm font-medium text-gray-700">Departure</span>
                </div>
                <p className="text-sm font-medium text-gray-900">{departureDateTime.date}</p>
                <p className="text-sm text-gray-600">{departureDateTime.time}</p>
              </div>
              <div className="bg-white rounded-md p-3 border">
                <div className="flex items-center gap-2 mb-2">
                  <FaClock className="text-green-500 text-sm" />
                  <span className="text-sm font-medium text-gray-700">Arrival</span>
                </div>
                <p className="text-sm font-medium text-gray-900">{arrivalDateTime.date}</p>
                <p className="text-sm text-gray-600">{arrivalDateTime.time}</p>
              </div>
            </div>
          </div>

          {/* Confirmation Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Type the flight number "{flight.flight_number}" to confirm deletion:
            </label>
            <input
              type="text"
              value={confirmationFlightNumber}
              onChange={(e) => setConfirmationFlightNumber(e.target.value)}
              placeholder={`Enter ${flight.flight_number}`}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !isConfirmationValid}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <FaTrash />
                  Delete Flight
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeleteFlightModal;
