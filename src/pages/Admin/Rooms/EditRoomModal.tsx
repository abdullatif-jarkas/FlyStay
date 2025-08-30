import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTimes, FaBed, FaHotel, FaDollarSign, FaUsers } from "react-icons/fa";
import {
  EditRoomModalProps,
  EditRoomFormData,
  RoomFormErrors,
  Hotel,
  ROOM_TYPES,
} from "../../../types/room";

const EditRoomModal: React.FC<EditRoomModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  room,
}) => {
  const [formData, setFormData] = useState<EditRoomFormData>({
    hotel_id: "",
    room_type: "",
    price_per_night: "",
    capacity: "",
  });
  const [errors, setErrors] = useState<RoomFormErrors>({});
  const [loading, setLoading] = useState(false);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loadingHotels, setLoadingHotels] = useState(false);

  const token = localStorage.getItem("token");

  // Initialize form data when room changes
  useEffect(() => {
    if (room && isOpen) {
      setFormData({
        hotel_id: room.hotel_id.toString(),
        room_type: room.room_type,
        price_per_night: room.price_per_night.toString(),
        capacity: room.capacity.toString(),
      });
      fetchHotels();
    }
  }, [room, isOpen]);

  const fetchHotels = async () => {
    setLoadingHotels(true);
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/hotel", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (res.data.status === "success") {
        setHotels(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch hotels:", err);
    } finally {
      setLoadingHotels(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof RoomFormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: RoomFormErrors = {};

    if (!formData.hotel_id.trim()) {
      newErrors.hotel_id = "Hotel selection is required";
    }

    if (!formData.room_type.trim()) {
      newErrors.room_type = "Room type is required";
    }

    if (!formData.price_per_night.trim()) {
      newErrors.price_per_night = "Price per night is required";
    } else if (
      isNaN(Number(formData.price_per_night)) ||
      Number(formData.price_per_night) <= 0
    ) {
      newErrors.price_per_night = "Price must be a valid positive number";
    }

    if (!formData.capacity.trim()) {
      newErrors.capacity = "Capacity is required";
    } else if (
      isNaN(Number(formData.capacity)) ||
      Number(formData.capacity) <= 0
    ) {
      newErrors.capacity = "Capacity must be a valid positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClose = () => {
    setFormData({
      hotel_id: "",
      room_type: "",
      price_per_night: "",
      capacity: "",
    });
    setErrors({});
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!room || !validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Create URL-encoded data as specified in the API requirements
      const urlEncodedData = new URLSearchParams();
      urlEncodedData.append("hotel_id", formData.hotel_id);
      urlEncodedData.append("room_type", formData.room_type);
      urlEncodedData.append("price_per_night", formData.price_per_night);
      urlEncodedData.append("capacity", formData.capacity);

      await axios.put(
        `http://127.0.0.1:8000/api/room/${room.id}`,
        urlEncodedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      onSuccess();
      handleClose();
    } catch (err: any) {
      setErrors({
        general:
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to update room",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !room) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Edit Room</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.general && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {errors.general}
            </div>
          )}

          {/* Current Room Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Current Room Information
            </h3>
            <div className="text-sm text-gray-600">
              <p>
                <strong>Hotel:</strong> {room.hotel.name}
              </p>
              <p>
                <strong>Room Type:</strong> {room.room_type.replace("_", " ")}
              </p>
              <p>
                <strong>Current Price:</strong> ${room.price_per_night}/night
              </p>
              <p>
                <strong>Current Capacity:</strong> {room.capacity} guests
              </p>
            </div>
          </div>

          {/* Hotel Selection */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <FaHotel className="text-primary-500" />
              Hotel *
            </label>
            <select
              name="hotel_id"
              value={formData.hotel_id}
              onChange={handleInputChange}
              disabled={loadingHotels}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.hotel_id ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">
                {loadingHotels ? "Loading hotels..." : "Select a hotel"}
              </option>
              {hotels.map((hotel) => (
                <option key={hotel.id} value={hotel.id}>
                  {hotel.name} - {hotel.city.name}
                </option>
              ))}
            </select>
            {errors.hotel_id && (
              <p className="text-red-500 text-sm mt-1">{errors.hotel_id}</p>
            )}
          </div>

          {/* Room Type */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <FaBed className="text-primary-500" />
              Room Type *
            </label>
            <select
              name="room_type"
              value={formData.room_type}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.room_type ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select room type</option>
              {ROOM_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors.room_type && (
              <p className="text-red-500 text-sm mt-1">{errors.room_type}</p>
            )}
          </div>

          {/* Price and Capacity Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Price per Night */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FaDollarSign className="text-primary-500" />
                Price per Night *
              </label>
              <input
                type="number"
                name="price_per_night"
                value={formData.price_per_night}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                placeholder="Enter price"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.price_per_night ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.price_per_night && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.price_per_night}
                </p>
              )}
            </div>

            {/* Capacity */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FaUsers className="text-primary-500" />
                Capacity *
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                min="1"
                placeholder="Number of guests"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.capacity ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.capacity && (
                <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>
              )}
            </div>
          </div>

          {/* Note about images */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> To update room images, use the "Manage
              Images" button in the actions column. This form only updates room
              details (hotel, type, price, capacity).
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Updating..." : "Update Room"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRoomModal;
