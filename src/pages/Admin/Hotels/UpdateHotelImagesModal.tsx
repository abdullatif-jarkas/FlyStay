import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUpload, FaTrash, FaImages, FaEye } from "react-icons/fa";
import { UpdateHotelImagesModalProps, ImagePreview } from "../../../types/hotel";

const UpdateHotelImagesModal: React.FC<UpdateHotelImagesModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  hotel,
}) => {
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<ImagePreview[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setNewImages([]);
      setNewImagePreviews([]);
      setDeletedImageIds([]);
      setError("");
    } else {
      // Clean up preview URLs
      newImagePreviews.forEach(preview => URL.revokeObjectURL(preview.url));
    }
  }, [isOpen]);

  const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      setError("Please select only image files (JPEG, PNG, WebP)");
      return;
    }

    // Validate file sizes (max 5MB each)
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setError("Each image must be less than 5MB");
      return;
    }

    // Create previews
    const previews: ImagePreview[] = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9),
    }));

    setNewImagePreviews(prev => [...prev, ...previews]);
    setNewImages(prev => [...prev, ...files]);
    setError("");
  };

  const removeNewImage = (index: number) => {
    const preview = newImagePreviews[index];
    URL.revokeObjectURL(preview.url);

    setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const toggleDeleteExistingImage = (imageId: number) => {
    setDeletedImageIds(prev => 
      prev.includes(imageId) 
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hotel) return;

    // Check if there are any changes
    if (newImages.length === 0 && deletedImageIds.length === 0) {
      setError("No changes to save. Please add new images or mark existing images for deletion.");
      return;
    }

    // Check if all existing images are being deleted and no new images are added
    const remainingImages = (hotel.images?.length || 0) - deletedImageIds.length;
    if (remainingImages + newImages.length === 0) {
      setError("Hotel must have at least one image. Please add new images before deleting all existing ones.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("_method", "put");

      // Add new images
      newImages.forEach((image, index) => {
        formData.append(`new_photos[${index}]`, image);
      });

      // Add deleted image IDs
      deletedImageIds.forEach((id, index) => {
        formData.append(`deleted_photos[${index}]`, id.toString());
      });

      // Add other hotel data to maintain consistency
      formData.append("name", hotel.name);
      formData.append("city_id", hotel.city_id.toString());
      formData.append("rating", hotel.rating.toString());
      formData.append("description", hotel.description);

      await axios.post(`http://127.0.0.1:8000/api/hotels/${hotel.id}/update-with-photo`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          // Don't set Content-Type, let axios handle it for FormData
        },
      });

      onSuccess();
      handleClose();
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        err.response?.data?.error || 
        "Failed to update hotel images"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Clean up preview URLs
    newImagePreviews.forEach(preview => URL.revokeObjectURL(preview.url));
    
    setNewImages([]);
    setNewImagePreviews([]);
    setDeletedImageIds([]);
    setError("");
    onClose();
  };

  if (!isOpen || !hotel) return null;

  const existingImages = hotel.images || [];
  const totalImagesAfterUpdate = existingImages.length - deletedImageIds.length + newImages.length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FaImages className="text-primary-600" />
              Manage Hotel Images - {hotel.name}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Summary */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-medium text-blue-800 mb-2">Update Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-blue-600">Current Images:</span>
                <span className="ml-2 font-semibold">{existingImages.length}</span>
              </div>
              <div>
                <span className="text-green-600">Adding:</span>
                <span className="ml-2 font-semibold">{newImages.length}</span>
              </div>
              <div>
                <span className="text-red-600">Removing:</span>
                <span className="ml-2 font-semibold">{deletedImageIds.length}</span>
              </div>
              <div>
                <span className="text-purple-600">Final Total:</span>
                <span className="ml-2 font-semibold">{totalImagesAfterUpdate}</span>
              </div>
            </div>
          </div>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Existing Images ({existingImages.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {existingImages.map((image) => (
                  <div
                    key={image.id}
                    className={`relative group border-2 rounded-lg overflow-hidden ${
                      deletedImageIds.includes(image.id) 
                        ? 'border-red-500 opacity-50' 
                        : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.alt || `Hotel image ${image.id}`}
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute inset-0 bg-transparent bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                        <button
                          type="button"
                          onClick={() => window.open(image.url, '_blank')}
                          className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
                        >
                          <FaEye />
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleDeleteExistingImage(image.id)}
                          className={`p-2 rounded-full transition-colors ${
                            deletedImageIds.includes(image.id)
                              ? 'bg-green-500 hover:bg-green-600 text-white'
                              : 'bg-red-500 hover:bg-red-600 text-white'
                          }`}
                        >
                          {deletedImageIds.includes(image.id) ? '↶' : <FaTrash />}
                        </button>
                      </div>
                    </div>
                    {deletedImageIds.includes(image.id) && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                        WILL DELETE
                      </div>
                    )}
                    {image.is_primary && (
                      <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold">
                        PRIMARY
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add New Images */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Add New Images
            </h3>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleNewImageChange}
                className="hidden"
                id="new-hotel-images"
              />
              <label
                htmlFor="new-hotel-images"
                className="flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 p-4 rounded transition-colors"
              >
                <FaUpload className="text-gray-400 text-3xl mb-3" />
                <span className="text-gray-600 font-medium">Click to upload new images</span>
                <span className="text-gray-400 text-sm mt-1">JPEG, PNG, WebP (max 5MB each)</span>
              </label>
            </div>

            {/* New Image Previews */}
            {newImagePreviews.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-gray-700 mb-3">
                  New Images to Add ({newImagePreviews.length})
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {newImagePreviews.map((preview, index) => (
                    <div key={preview.id} className="relative group border-2 border-green-200 rounded-lg overflow-hidden">
                      <img
                        src={preview.url}
                        alt={`New image ${index + 1}`}
                        className="w-full h-32 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      >
                        <FaTrash className="text-xs" />
                      </button>
                      <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
                        NEW
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Validation Warning */}
          {totalImagesAfterUpdate === 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-medium">
                ⚠️ Warning: Hotel must have at least one image. Please add new images before removing all existing ones.
              </p>
            </div>
          )}

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
              disabled={loading || totalImagesAfterUpdate === 0 || (newImages.length === 0 && deletedImageIds.length === 0)}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Updating Images...
                </>
              ) : (
                <>
                  <FaImages />
                  Update Images
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateHotelImagesModal;
