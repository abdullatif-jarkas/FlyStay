import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaTimes,
  FaUpload,
  FaTrash,
  FaImages,
  FaPlus,
  FaExclamationTriangle,
  FaBed,
} from "react-icons/fa";
import {
  UpdateRoomImagesModalProps,
  ImagePreview,
  // DeleteImageConfirmation,
} from "../../../types/room";

const UpdateRoomImagesModal: React.FC<UpdateRoomImagesModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  room,
}) => {
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<ImagePreview[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);
  // const [deleteConfirmations, setDeleteConfirmations] = useState<DeleteImageConfirmation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (isOpen && room) {
      // Initialize delete confirmations for existing images
      // const confirmations = room.images?.map(img => ({
      //   id: img.id,
      //   url: img.url,
      //   confirmed: false
      // })) || [];
      // setDeleteConfirmations(confirmations);
    }
  }, [isOpen, room]);

  const formatRoomType = (roomType: string) => {
    return roomType
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // Validate file types and sizes
    const validFiles = files.filter((file) => {
      const isValidType = file.type.startsWith("image/");
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      setError("Some files were rejected. Only images under 5MB are allowed.");
    } else {
      setError("");
    }

    // Create previews for new images
    const newPreviews: ImagePreview[] = validFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9),
    }));

    setNewImagePreviews((prev) => [...prev, ...newPreviews]);
    setNewImages((prev) => [...prev, ...validFiles]);
  };

  const removeNewImage = (index: number) => {
    const preview = newImagePreviews[index];
    URL.revokeObjectURL(preview.url);

    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleDeleteImage = (imageId: number) => {
    // setDeleteConfirmations(prev =>
    //   prev.map((conf: any) =>
    //     conf.id === imageId
    //       ? { ...conf, confirmed: !conf.confirmed }
    //       : conf
    //   )
    // );

    setImagesToDelete((prev) => {
      if (prev.includes(imageId)) {
        return prev.filter((id) => id !== imageId);
      } else {
        return [...prev, imageId];
      }
    });
  };

  const handleClose = () => {
    // Clean up new image previews
    newImagePreviews.forEach((preview) => URL.revokeObjectURL(preview.url));

    setNewImages([]);
    setNewImagePreviews([]);
    setImagesToDelete([]);
    // setDeleteConfirmations([]);
    setError("");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!room) return;

    // Check if there are any changes
    if (newImages.length === 0 && imagesToDelete.length === 0) {
      setError(
        "No changes to save. Please add new images or select images to delete."
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();

      // Add method override for Laravel
      formData.append("_method", "PUT");

      // Add new images
      newImages.forEach((image, index) => {
        formData.append(`new_photos[${index}]`, image);
      });

      // Add images to delete
      imagesToDelete.forEach((imageId, index) => {
        formData.append(`deleted_photos[${index}]`, imageId.toString());
      });

      await axios.post(
        `http://127.0.0.1:8000/api/rooms/${room.id}/update-with-photo`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            // Don't set Content-Type, let axios handle it for FormData
          },
        }
      );

      onSuccess();
      handleClose();
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to update room images"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !room) return null;

  const existingImages = room.images || [];
  const hasChanges = newImages.length > 0 || imagesToDelete.length > 0;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <FaImages className="text-primary-500" />
            Manage Room Images
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Room Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <FaBed className="text-primary-500" />
              Room Information
            </h3>
            <div className="text-sm text-gray-600">
              <p>
                <strong>Room Type:</strong> {formatRoomType(room.room_type)}
              </p>
              <p>
                <strong>Hotel:</strong> {room.hotel.name}
              </p>
              <p>
                <strong>Current Images:</strong> {existingImages.length} photos
              </p>
            </div>
          </div>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-800">
                Current Images ({existingImages.length})
              </h4>
              <p className="text-sm text-gray-600">
                Click on images you want to delete. Selected images will be
                marked with a red overlay.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {existingImages.map((image) => {
                  const isMarkedForDeletion = imagesToDelete.includes(image.id);
                  return (
                    <div key={image.id} className="relative group">
                      <div
                        className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                          isMarkedForDeletion
                            ? "border-red-500 ring-2 ring-red-200"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => toggleDeleteImage(image.id)}
                      >
                        <img
                          src={image.url}
                          alt={`Room image ${image.id}`}
                          className="w-full h-24 object-cover"
                        />

                        {/* Delete Overlay */}
                        {isMarkedForDeletion && (
                          <div className="absolute inset-0 bg-red-500 bg-opacity-50 flex items-center justify-center">
                            <FaTrash className="text-white text-xl" />
                          </div>
                        )}

                        {/* Delete Button */}
                        <button
                          type="button"
                          className={`absolute top-1 right-1 p-1 rounded-full transition-all ${
                            isMarkedForDeletion
                              ? "bg-red-500 text-white"
                              : "bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDeleteImage(image.id);
                          }}
                        >
                          <FaTrash className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {imagesToDelete.length > 0 && (
                <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                  <div className="flex items-start gap-2">
                    <FaExclamationTriangle className="text-red-500 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-red-700">
                      <p className="font-medium">
                        {imagesToDelete.length} image(s) selected for deletion
                      </p>
                      <p>
                        These images will be permanently removed when you save
                        changes.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Add New Images */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FaPlus className="text-green-500" />
              Add New Images
            </h4>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FaUpload className="text-primary-500" />
                Select Images to Upload
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleNewImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Maximum file size: 5MB per image. Supported formats: JPG, PNG,
                GIF, WebP
              </p>
            </div>

            {/* New Image Previews */}
            {newImagePreviews.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">
                  New Images to Upload ({newImagePreviews.length})
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {newImagePreviews.map((preview, index) => (
                    <div key={preview.id} className="relative group">
                      <img
                        src={preview.url}
                        alt={`New image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FaTrash className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Summary */}
          {hasChanges && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">
                Changes Summary:
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                {newImages.length > 0 && (
                  <li>• {newImages.length} new image(s) will be added</li>
                )}
                {imagesToDelete.length > 0 && (
                  <li>
                    • {imagesToDelete.length} existing image(s) will be deleted
                  </li>
                )}
              </ul>
            </div>
          )}

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
              disabled={loading || !hasChanges}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateRoomImagesModal;
