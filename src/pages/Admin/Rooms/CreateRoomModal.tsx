import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaTimes,
  FaUpload,
  FaTrash,
  FaBed,
  FaHotel,
  FaDollarSign,
  FaUsers,
} from "react-icons/fa";
import {
  CreateRoomModalProps,
  CreateRoomFormData,
  RoomFormErrors,
  ImagePreview,
  Hotel,
  ROOM_TYPES,
} from "../../../types/room";

const CreateRoomModal: React.FC<CreateRoomModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<CreateRoomFormData>({
    hotel_id: "",
    room_type: "",
    price_per_night: "",
    capacity: "",
    images: [],
  });
  const [errors, setErrors] = useState<RoomFormErrors>({});
  const [loading, setLoading] = useState(false);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loadingHotels, setLoadingHotels] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);

  const token = localStorage.getItem("token");

  // Fetch hotels for dropdown
  useEffect(() => {
    if (isOpen) {
      fetchHotels();
    }
  }, [isOpen]);

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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof RoomFormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // Validate file types and sizes
    const validFiles = files.filter((file) => {
      const isValidType = file.type.startsWith("image/");
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      setErrors((prev) => ({
        ...prev,
        images: "Some files were rejected. Only images under 5MB are allowed.",
      }));
    }

    // Create previews
    const newPreviews: ImagePreview[] = validFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9),
    }));

    setImagePreviews((prev) => [...prev, ...newPreviews]);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...validFiles],
    }));

    // Clear image error
    if (errors.images) {
      setErrors((prev) => ({ ...prev, images: undefined }));
    }
  };

  const removeImage = (index: number) => {
    const preview = imagePreviews[index];
    URL.revokeObjectURL(preview.url);

    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
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
    // Clean up image previews
    imagePreviews.forEach((preview) => URL.revokeObjectURL(preview.url));

    setFormData({
      hotel_id: "",
      room_type: "",
      price_per_night: "",
      capacity: "",
      images: [],
    });
    setErrors({});
    setImagePreviews([]);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("hotel_id", formData.hotel_id.toString());
      formDataToSend.append("room_type", formData.room_type);
      formDataToSend.append(
        "price_per_night",
        formData.price_per_night.toString()
      );
      formDataToSend.append("capacity", formData.capacity.toString());

      // Append images with same key 'images[]'
      formData.images.forEach((image) => {
        formDataToSend.append("images[]", image);
      });

      await axios.post("http://127.0.0.1:8000/api/room", formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          // لا تحدد Content-Type لأن axios يتعامل مع FormData
        },
      });

      onSuccess();
      handleClose();
    } catch (err: any) {
      if (err.response?.status === 422) {
        setErrors(
          err.response.data.errors || {
            general: err.response.data.message || "Validation error",
          }
        );
      } else {
        setErrors({ general: err.message || "Failed to create room" });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Create New Room
          </h2>
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

          {/* Image Upload */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <FaUpload className="text-primary-500" />
              Room Images
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {errors.images && (
              <p className="text-red-500 text-sm mt-1">{errors.images}</p>
            )}

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={preview.id} className="relative group">
                    <img
                      src={preview.url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-md border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FaTrash className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
              {loading ? "Creating..." : "Create Room"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRoomModal;
