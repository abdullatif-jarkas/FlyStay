import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaTrash, FaStar, FaUpload } from "react-icons/fa";
import { CreateHotelModalProps, CreateHotelFormData, City, ImagePreview, HotelFormErrors } from "../../../types/hotel";
import { toast } from "sonner";

const CreateHotelModal: React.FC<CreateHotelModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<CreateHotelFormData>({
    name: "",
    city_id: "",
    rating: "5",
    description: "",
    images: [],
  });
  const [cities, setCities] = useState<City[]>([]);
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [errors, setErrors] = useState<HotelFormErrors>({});

  const token = localStorage.getItem("token");

  // Fetch cities for dropdown
  useEffect(() => {
    if (isOpen) {
      fetchCities();
    }
  }, [isOpen]);

  const fetchCities = async () => {
    setLoadingCities(true);
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/get-all-cities", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        params: { per_page: 100 }, // Get more cities for dropdown
      });

      if (response.data.status === "success") {
        setCities(response.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch cities:", err);
    } finally {
      setLoadingCities(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof HotelFormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      setErrors(prev => ({
        ...prev,
        images: "Please select only image files (JPEG, PNG, WebP)",
      }));
      return;
    }

    // Validate file sizes (max 5MB each)
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setErrors(prev => ({
        ...prev,
        images: "Each image must be less than 5MB",
      }));
      return;
    }

    // Create previews
    const newPreviews: ImagePreview[] = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9),
    }));

    setImagePreviews(prev => [...prev, ...newPreviews]);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files],
    }));

    // Clear image errors
    setErrors(prev => ({
      ...prev,
      images: undefined,
    }));
  };

  const removeImage = (index: number) => {
    const preview = imagePreviews[index];
    URL.revokeObjectURL(preview.url);

    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: HotelFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Hotel name is required";
    }

    if (!formData.city_id) {
      newErrors.city_id = "Please select a city";
    }

    if (!formData.rating || parseInt(formData.rating) < 1 || parseInt(formData.rating) > 5) {
      newErrors.rating = "Rating must be between 1 and 5";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (formData.images.length === 0) {
      newErrors.images = "At least one image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
      formDataToSend.append("name", formData.name);
      formDataToSend.append("city_id", formData.city_id);
      formDataToSend.append("rating", formData.rating);
      formDataToSend.append("description", formData.description);

      // Append images
      formData.images.forEach((image, index) => {
        formDataToSend.append(`images[${index}]`, image);
      });

      await axios.post("http://127.0.0.1:8000/api/hotel", formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          // Don't set Content-Type, let axios handle it for FormData
        },
      });
      toast.success("Hotel created successfully");
      onSuccess();
      handleClose();
    } catch (err: any) {
      setErrors({
        general: err.response?.data?.message || 
                err.response?.data?.error || 
                "Failed to create hotel"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Clean up image previews
    imagePreviews.forEach(preview => URL.revokeObjectURL(preview.url));
    
    setFormData({
      name: "",
      city_id: "",
      rating: "5",
      description: "",
      images: [],
    });
    setImagePreviews([]);
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Create New Hotel</h2>
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
              placeholder="Enter hotel name (e.g., Frankfort Hotel)"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
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
                errors.city_id ? 'border-red-500' : 'border-gray-300'
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
            {errors.city_id && <p className="text-red-500 text-xs mt-1">{errors.city_id}</p>}
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
                  errors.rating ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
              <div className="flex">
                {[1, 2, 3, 4, 5].map(star => (
                  <FaStar
                    key={star}
                    className={`text-lg ${
                      star <= parseInt(formData.rating) ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            {errors.rating && <p className="text-red-500 text-xs mt-1">{errors.rating}</p>}
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
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hotel Images <span className="text-red-500">*</span>
            </label>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="hotel-images"
              />
              <label
                htmlFor="hotel-images"
                className="flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 p-4 rounded"
              >
                <FaUpload className="text-gray-400 text-2xl mb-2" />
                <span className="text-gray-600">Click to upload images</span>
                <span className="text-gray-400 text-xs">JPEG, PNG, WebP (max 5MB each)</span>
              </label>
            </div>

            {errors.images && <p className="text-red-500 text-xs mt-1">{errors.images}</p>}

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {imagePreviews.map((preview, index) => (
                  <div key={preview.id} className="relative group">
                    <img
                      src={preview.url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
                  Creating...
                </>
              ) : (
                <>
                  <FaPlus />
                  Create Hotel
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateHotelModal;
