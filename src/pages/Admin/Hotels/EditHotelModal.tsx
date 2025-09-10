import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaStar, FaEdit } from "react-icons/fa";
import {
  EditHotelModalProps,
  EditHotelFormData,
  City,
  HotelFormErrors,
} from "../../../types/hotel";

const EditHotelModal: React.FC<EditHotelModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  hotel,
}) => {
  const [formData, setFormData] = useState<EditHotelFormData>({
    name: "",
    city_id: "",
    rating: "5",
    description: "",
  });
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [errors, setErrors] = useState<HotelFormErrors>({});

  const token = localStorage.getItem("token");

  // Initialize form data when hotel prop changes
  useEffect(() => {
    if (isOpen && hotel) {
      setFormData({
        name: hotel.name,
        city_id: hotel.city_id.toString(),
        rating: hotel.rating.toString(),
        description: hotel.description,
      });
      fetchCities();
    }
  }, [isOpen, hotel]);

  const fetchCities = async () => {
    setLoadingCities(true);
    try {
      // أول صفحة
      const firstPageResponse = await axios.get(
        "http://127.0.0.1:8000/api/get-all-cities?page=1&per_page=100",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (firstPageResponse.data.status === "success") {
        const firstPageData = firstPageResponse.data;
        let allCities = [...firstPageData.data];

        // عدد الصفحات
        const totalPages = firstPageData.pagination?.total_pages || 1;

        if (totalPages > 1) {
          const pagePromises: Promise<import("axios").AxiosResponse<any>>[] =
            [];

          for (let page = 2; page <= totalPages; page++) {
            const pagePromise = axios.get(
              `http://127.0.0.1:8000/api/get-all-cities?page=${page}&per_page=100`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  Accept: "application/json",
                },
              }
            );
            pagePromises.push(pagePromise);
          }

          const pageResponses = await Promise.all(pagePromises);

          pageResponses.forEach((response) => {
            if (response.data.status === "success") {
              allCities = [...allCities, ...response.data.data];
            }
          });
        }

        setCities(allCities);
      }
    } catch (err) {
      console.error("Failed to fetch cities:", err);
      setCities([]);
    } finally {
      setLoadingCities(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof HotelFormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: HotelFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Hotel name is required";
    }

    if (!formData.city_id) {
      newErrors.city_id = "Please select a city";
    }

    if (
      !formData.rating ||
      parseInt(formData.rating) < 1 ||
      parseInt(formData.rating) > 5
    ) {
      newErrors.rating = "Rating must be between 1 and 5";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hotel || !validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Create URL-encoded data as specified in the API requirements
      const urlEncodedData = new URLSearchParams();
      urlEncodedData.append("name", formData.name);
      urlEncodedData.append("city_id", formData.city_id);
      urlEncodedData.append("rating", formData.rating);
      urlEncodedData.append("description", formData.description);

      await axios.put(
        `http://127.0.0.1:8000/api/hotel/${hotel.id}`,
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
          "Failed to update hotel",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      city_id: "",
      rating: "5",
      description: "",
    });
    setErrors({});
    onClose();
  };

  if (!isOpen || !hotel) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Edit Hotel</h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.general && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {errors.general}
            </div>
          )}

          {/* Current Hotel Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Current Hotel Information
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600">ID:</span>
                <span className="ml-2 font-mono">{hotel.id}</span>
              </div>
              <div>
                <span className="text-gray-600">Current City:</span>
                <span className="ml-2">
                  {hotel.city.name}, {hotel.country.name}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Created:</span>
                <span className="ml-2">
                  {new Date(hotel.created_at).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Images:</span>
                <span className="ml-2">{hotel.images?.length || 0} images</span>
              </div>
            </div>
          </div>

          {/* Hotel Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hotel Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter hotel name"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* City Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City <span className="text-red-500">*</span>
            </label>
            <select
              name="city_id"
              value={formData.city_id}
              onChange={handleInputChange}
              disabled={loadingCities}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                errors.city_id ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">
                {loadingCities ? "Loading cities..." : "Select a city"}
              </option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}, {city.country.name}
                </option>
              ))}
            </select>
            {errors.city_id && (
              <p className="text-red-500 text-xs mt-1">{errors.city_id}</p>
            )}
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <select
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
                className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.rating ? "border-red-500" : "border-gray-300"
                }`}
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={`text-lg ${
                      star <= parseInt(formData.rating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            {errors.rating && (
              <p className="text-red-500 text-xs mt-1">{errors.rating}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              placeholder="Enter hotel description..."
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-vertical ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          {/* Note about images */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-blue-800 text-sm">
              <strong>Note:</strong> To update hotel images, use the "Manage
              Images" action from the main table. This form only updates basic
              hotel information.
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
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
              disabled={loading}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Updating...
                </>
              ) : (
                <>
                  <FaEdit />
                  Update Hotel
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditHotelModal;
