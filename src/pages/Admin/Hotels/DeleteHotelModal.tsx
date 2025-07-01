import React, { useState } from "react";
import axios from "axios";
import { FaTrash, FaExclamationTriangle, FaHotel, FaMapMarkerAlt, FaStar } from "react-icons/fa";
import { DeleteHotelModalProps } from "../../../types/hotel";

const DeleteHotelModal: React.FC<DeleteHotelModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  hotel,
}) => {
  const [confirmationName, setConfirmationName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hotel) return;

    // Validate confirmation name
    if (confirmationName.trim().toLowerCase() !== hotel.name.toLowerCase()) {
      setError("Hotel name confirmation does not match. Please type the exact hotel name.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Create URL-encoded data as specified in the API requirements
      const urlEncodedData = new URLSearchParams();
      urlEncodedData.append("name", hotel.name);

      await axios.delete(`http://127.0.0.1:8000/api/hotel/${hotel.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: urlEncodedData,
      });

      onSuccess();
      handleClose();
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        err.response?.data?.error || 
        "Failed to delete hotel"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setConfirmationName("");
    setError("");
    onClose();
  };

  const isConfirmationValid = confirmationName.trim().toLowerCase() === hotel?.name.toLowerCase();

  if (!isOpen || !hotel) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="border-b px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <FaExclamationTriangle className="text-red-600 text-lg" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Delete Hotel</h2>
              <p className="text-sm text-gray-600">This action cannot be undone</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Hotel Information */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <FaHotel className="text-gray-600 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-2">{hotel.name}</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-red-500" />
                    <span>{hotel.city.name}, {hotel.country.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map(star => (
                        <FaStar
                          key={star}
                          className={`text-xs ${
                            star <= hotel.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span>({hotel.rating}/5)</span>
                  </div>
                  <div>
                    <span className="font-medium">ID:</span> {hotel.id}
                  </div>
                  <div>
                    <span className="font-medium">Images:</span> {hotel.images?.length || 0}
                  </div>
                  <div>
                    <span className="font-medium">Created:</span> {new Date(hotel.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Warning Message */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex gap-3">
              <FaExclamationTriangle className="text-red-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-red-800 mb-1">Warning: This action is irreversible!</p>
                <ul className="text-red-700 space-y-1">
                  <li>• The hotel record will be permanently deleted</li>
                  <li>• All associated images will be removed</li>
                  <li>• Any bookings or reservations may be affected</li>
                  <li>• This action cannot be undone</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Confirmation Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To confirm deletion, please type the hotel name exactly as shown:
            </label>
            <div className="mb-2">
              <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                {hotel.name}
              </code>
            </div>
            <input
              type="text"
              value={confirmationName}
              onChange={(e) => {
                setConfirmationName(e.target.value);
                if (error && e.target.value.trim()) {
                  setError("");
                }
              }}
              placeholder="Type hotel name here..."
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <p className="text-xs text-gray-500 mt-1">
              Case insensitive - you can type in lowercase
            </p>
          </div>

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
                  Delete Hotel
                </>
              )}
            </button>
          </div>

          {/* Confirmation Status */}
          <div className="mt-3 text-center">
            {confirmationName && (
              <p className={`text-xs ${
                isConfirmationValid ? 'text-green-600' : 'text-red-600'
              }`}>
                {isConfirmationValid ? '✓ Name confirmed' : '✗ Name does not match'}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeleteHotelModal;
