import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaTimes,
  FaBed,
  FaHotel,
  FaDollarSign,
  FaUsers,
  FaCalendarAlt,
  FaImages,
  FaInfoCircle,
  FaChevronLeft,
  FaChevronRight,
  FaExpand,
} from "react-icons/fa";
import { ShowRoomModalProps, Room } from "../../../types/room";

const ShowRoomModal: React.FC<ShowRoomModalProps> = ({
  isOpen,
  onClose,
  roomId,
}) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (isOpen && roomId) {
      fetchRoomDetails();
    }
  }, [isOpen, roomId]);

  const fetchRoomDetails = async () => {
    if (!roomId) return;

    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/room/${roomId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data.status === "success") {
        setRoom(response.data.data[0]);
      } else {
        setError("Failed to load room details");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to load room details"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setRoom(null);
    setError("");
    setCurrentImageIndex(0);
    setShowImageModal(false);
    onClose();
  };

  const nextImage = () => {
    if (room?.images && room.images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === room.images!.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (room?.images && room.images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? room.images!.length - 1 : prev - 1
      );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatRoomType = (roomType: string) => {
    return roomType
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Room Details
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                <span className="ml-2 text-gray-600">
                  Loading room details...
                </span>
              </div>
            )}

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {room && (
              <div className="space-y-6">
                {/* Room Header */}
                <div className="bg-gradient-to-r from-primary-50 to-primary-100 p-6 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        {formatRoomType(room.room_type)}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <FaHotel className="text-primary-500" />
                        {/* <span>{room.hotel.name}</span> */}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <FaDollarSign className="text-green-500" />$
                          {room.price_per_night}/night
                        </span>
                        <span className="flex items-center gap-1">
                          <FaUsers className="text-blue-500" />
                          {room.capacity} guests
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Image Gallery */}
                {room.images && room.images.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <FaImages className="text-primary-500" />
                      Room Images ({room.images.length})
                    </h4>

                    {/* Main Image */}
                    <div className="relative">
                      <img
                        src={room.images[currentImageIndex].url}
                        alt={`Room image ${currentImageIndex + 1}`}
                        className="w-full h-64 object-cover rounded-lg border border-gray-200 cursor-pointer"
                        onClick={() => setShowImageModal(true)}
                      />

                      {/* Image Navigation */}
                      {room.images.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                          >
                            <FaChevronLeft />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                          >
                            <FaChevronRight />
                          </button>

                          {/* Expand Button */}
                          <button
                            onClick={() => setShowImageModal(true)}
                            className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                          >
                            <FaExpand />
                          </button>
                        </>
                      )}

                      {/* Image Counter */}
                      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                        {currentImageIndex + 1} / {room.images.length}
                      </div>
                    </div>

                    {/* Thumbnail Gallery */}
                    {room.images.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {room.images.map((image, index) => (
                          <img
                            key={image.id}
                            src={image.url}
                            alt={`Thumbnail ${index + 1}`}
                            className={`w-16 h-16 object-cover rounded cursor-pointer border-2 transition-all ${
                              index === currentImageIndex
                                ? "border-primary-500"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() => setCurrentImageIndex(index)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Room Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Hotel Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <FaHotel className="text-primary-500" />
                      Hotel Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">
                          Hotel Name:
                        </span>
                        <p className="text-gray-600">{room.hotel.name}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Rating:</span>
                        <p className="text-2xl font-bold text-yellow-600">{room.hotel.rating}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Description:</span>
                        <p className="text-gray-600">{room.hotel.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Room Specifications */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <FaBed className="text-primary-500" />
                      Room Specifications
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">
                          Room Type:
                        </span>
                        <p className="text-gray-600">
                          {formatRoomType(room.room_type)}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">
                          Price per Night:
                        </span>
                        <p className="text-2xl font-bold text-green-600">
                          ${room.price_per_night}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">
                          Maximum Capacity:
                        </span>
                        <p className="text-gray-600">{room.capacity} guests</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Metadata */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FaInfoCircle className="text-primary-500" />
                    Additional Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">
                        Room ID:
                      </span>
                      <p className="text-gray-600">#{room.id}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">
                        Total Images:
                      </span>
                      <p className="text-gray-600">
                        {room.images?.length || 0} photos
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end p-6 border-t border-gray-200">
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Full Screen Image Modal */}
      {showImageModal && room?.images && room.images.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-60 p-4">
          <div className="relative max-w-full max-h-full">
            <img
              src={room.images[currentImageIndex].url}
              alt={`Room image ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />

            {/* Close Button */}
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
            >
              <FaTimes />
            </button>

            {/* Navigation */}
            {room.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all"
                >
                  <FaChevronLeft />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all"
                >
                  <FaChevronRight />
                </button>
              </>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded">
              {currentImageIndex + 1} / {room.images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShowRoomModal;
