import React, { useState } from "react";
import axios from "axios";
import { FaPlane, FaTimes, FaSpinner, FaExclamationTriangle } from "react-icons/fa";
import {
  DeleteFlightCabinModalProps,
  FLIGHT_CABIN_ENDPOINTS,
  formatPrice,
  getClassBadgeColor,
  formatFlightRoute,
} from "../../../types/flightCabin";

const DeleteFlightCabinModal: React.FC<DeleteFlightCabinModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  flightCabin,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmationText, setConfirmationText] = useState("");

  const token = localStorage.getItem("token");

  const handleDelete = async () => {
    if (!flightCabin) return;

    // Require confirmation text
    const expectedText = `${flightCabin.flight.airline} ${flightCabin.flight.flight_number} ${flightCabin.class_name}`;
    if (confirmationText !== expectedText) {
      setError(`Please type "${expectedText}" to confirm deletion`);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000${FLIGHT_CABIN_ENDPOINTS.DELETE(flightCabin.id)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data.status === "success") {
        onSuccess();
        handleClose();
      } else {
        setError(response.data.message || "Failed to delete flight cabin");
      }
    } catch (err: any) {
      console.error("Error deleting flight cabin:", err);
      setError(
        err.response?.data?.message || "Failed to delete flight cabin"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setConfirmationText("");
    setError("");
    onClose();
  };

  if (!isOpen || !flightCabin) return null;

  const expectedConfirmationText = `${flightCabin.flight.airline} ${flightCabin.flight.flight_number} ${flightCabin.class_name}`;
  const hasBookings = flightCabin.bookings && flightCabin.bookings.length > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white h-[90vh] overflow-y-auto rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <FaExclamationTriangle className="text-red-500 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Delete Flight Cabin</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Warning */}
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <FaExclamationTriangle className="text-red-500 mr-2" />
              <span className="font-semibold text-red-700">Warning: This action cannot be undone!</span>
            </div>
            <p className="text-gray-700 mb-4">
              You are about to permanently delete this flight cabin. This will remove all associated data.
            </p>

            {hasBookings && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
                <div className="flex items-center">
                  <FaExclamationTriangle className="text-yellow-500 mr-2" />
                  <span className="font-medium text-yellow-800">
                    This cabin has {flightCabin.bookings?.length} active booking(s)!
                  </span>
                </div>
                <p className="text-yellow-700 text-sm mt-1">
                  Deleting this cabin may affect existing bookings and customer reservations.
                </p>
              </div>
            )}
          </div>

          {/* Flight Cabin Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <FaPlane className="mr-2 text-primary-500" />
              Flight Cabin to Delete
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Flight:</span>
                <span className="font-medium">
                  {flightCabin.flight.airline} {flightCabin.flight.flight_number}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Route:</span>
                <span className="font-medium">{formatFlightRoute(flightCabin.flight)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Class:</span>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getClassBadgeColor(
                    flightCabin.class_name
                  )}`}
                >
                  {flightCabin.class_name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Price:</span>
                <span className="font-medium text-green-600">
                  {formatPrice(flightCabin.price)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Available Seats:</span>
                <span className="font-medium">{flightCabin.available_seats}</span>
              </div>
              {hasBookings && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Bookings:</span>
                  <span className="font-medium text-red-600">
                    {flightCabin.bookings?.length} active
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Confirmation Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type the following to confirm deletion:
            </label>
            <div className="bg-gray-100 p-2 rounded mb-2 font-mono text-sm">
              {expectedConfirmationText}
            </div>
            <input
              type="text"
              value={confirmationText}
              onChange={(e) => {
                setConfirmationText(e.target.value);
                if (error) setError("");
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Type the confirmation text here"
              disabled={loading}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={loading || confirmationText !== expectedConfirmationText}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading && <FaSpinner className="animate-spin mr-2" />}
              Delete Flight Cabin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteFlightCabinModal;
