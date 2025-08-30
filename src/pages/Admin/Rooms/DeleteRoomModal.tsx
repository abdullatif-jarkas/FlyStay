import React, { useState } from "react";
import axios from "axios";
import {
  FaTimes,
  FaExclamationTriangle,
  FaBed,
  FaDollarSign,
  FaUsers,
  FaImages,
} from "react-icons/fa";
import { DeleteRoomModalProps } from "../../../types/room";

const DeleteRoomModal: React.FC<DeleteRoomModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  room,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmationPrice, setConfirmationPrice] = useState("");

  const token = localStorage.getItem("token");

  const handleClose = () => {
    setError("");
    setConfirmationPrice("");
    onClose();
  };

  const formatRoomType = (roomType: string) => {
    return roomType
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleDelete = async () => {
    if (!room) return;

    // Validate price confirmation
    if (confirmationPrice !== room.price_per_night.toString()) {
      setError(
        "Price confirmation does not match. Please enter the exact price per night."
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Create URL-encoded data with price confirmation as specified in API requirements
      const urlEncodedData = new URLSearchParams();
      urlEncodedData.append("price_per_night", confirmationPrice);

      await axios.delete(`http://127.0.0.1:8000/api/room/${room.id}`, {
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
          "Failed to delete room"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !room) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <FaExclamationTriangle className="text-red-500" />
            Delete Room
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="mb-6">
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete this room? This action cannot be
              undone.
            </p>

            {/* Room Details */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <FaBed className="text-primary-500" />
                Room Information
              </h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Room Type:</span>
                  <span className="font-medium">
                    {formatRoomType(room.room_type)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Hotel:</span>
                  <span className="font-medium">{room.hotel.name}</span>
                </div>

                {/* <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span>
                    {room.hotel.city.name}, {room.hotel.country.name}
                  </span>
                </div> */}

                <div className="flex justify-between">
                  <span className="text-gray-600 flex items-center gap-1">
                    <FaDollarSign className="text-green-500" />
                    Price per Night:
                  </span>
                  <span className="font-bold text-green-600">
                    ${room.price_per_night}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600 flex items-center gap-1">
                    <FaUsers className="text-blue-500" />
                    Capacity:
                  </span>
                  <span>{room.capacity} guests</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600 flex items-center gap-1">
                    <FaImages className="text-purple-500" />
                    Images:
                  </span>
                  <span>{room.images?.length || 0} photos</span>
                </div>
              </div>
            </div>
          </div>

          {/* Price Confirmation */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To confirm deletion, please enter the room's price per night:
              <span className="font-bold text-red-600">
                ${room.price_per_night}
              </span>
            </label>
            <input
              type="number"
              value={confirmationPrice}
              onChange={(e) => setConfirmationPrice(e.target.value)}
              placeholder="Enter price per night"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {/* Warning */}
          <div className="bg-red-50 border border-red-200 p-3 rounded-lg mb-6">
            <div className="flex items-start gap-2">
              <FaExclamationTriangle className="text-red-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-700">
                <p className="font-medium">Warning:</p>
                <ul className="mt-1 list-disc list-inside space-y-1">
                  <li>
                    This will permanently delete the room and all its data
                  </li>
                  <li>All room images will be removed</li>
                  <li>Any existing bookings for this room may be affected</li>
                  <li>This action cannot be undone</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={
                loading || confirmationPrice !== room.price_per_night.toString()
              }
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Deleting..." : "Delete Room"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteRoomModal;
