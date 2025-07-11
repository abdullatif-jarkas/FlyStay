import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  FaHotel, 
  FaStar, 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaImages, 
  FaInfoCircle,
  FaChevronLeft,
  FaChevronRight,
  FaExpand
} from "react-icons/fa";
import { ShowHotelModalProps, Hotel } from "../../../types/hotel";

const ShowHotelModal: React.FC<ShowHotelModalProps> = ({
  isOpen,
  onClose,
  hotelId,
}) => {
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (isOpen && hotelId) {
      fetchHotelDetails();
    }
  }, [isOpen, hotelId]);

  const fetchHotelDetails = async () => {
    if (!hotelId) return;

    setLoading(true);
    setError("");

    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/hotel/${hotelId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.data.status === "success") {
        setHotel(response.data.data[0]);
      } else {
        setError("Failed to load hotel details");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        err.response?.data?.error || 
        "Failed to load hotel details"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const nextImage = () => {
    if (hotel?.images && hotel.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === hotel.images!.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (hotel?.images && hotel.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? hotel.images!.length - 1 : prev - 1
      );
    }
  };

  const handleClose = () => {
    setHotel(null);
    setError("");
    setCurrentImageIndex(0);
    setShowImageModal(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="sticky z-10 top-0 bg-white border-b px-6 py-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FaHotel className="text-primary-600" />
                Hotel Details
              </h2>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="p-6">
            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                <span className="ml-2 text-gray-600">Loading hotel details...</span>
              </div>
            )}

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {hotel && !loading && (
              <div className="space-y-6">
                {/* Hotel Basic Info */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">{hotel.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <FaMapMarkerAlt className="text-red-500" />
                        <span className="text-gray-700">
                          {hotel.city.name}, {hotel.country.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <FaStar
                            key={star}
                            className={`text-lg ${
                              star <= hotel.rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-gray-600">({hotel.rating}/5)</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Hotel ID</div>
                      <div className="font-mono text-lg">{hotel.id}</div>
                    </div>
                  </div>
                </div>

                {/* Hotel Images Gallery */}
                {hotel.images && hotel.images.length > 0 && (
                  <div className="bg-white rounded-lg border p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <FaImages className="text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-800">
                        Hotel Images ({hotel.images.length})
                      </h3>
                    </div>
                    
                    <div className="relative">
                      <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                        {console.log(hotel.images[currentImageIndex].image_path)}
                        <img
                          src={hotel.images[currentImageIndex].image_path}
                          alt={hotel.images[currentImageIndex].alt || `Hotel image ${currentImageIndex + 1}`}
                          className="w-full h-full object-cover cursor-pointer"
                          onClick={() => setShowImageModal(true)}
                        />
                        <button
                          onClick={() => setShowImageModal(true)}
                          className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                        >
                          <FaExpand />
                        </button>
                      </div>
                      
                      {hotel.images.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                          >
                            <FaChevronLeft />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                          >
                            <FaChevronRight />
                          </button>
                        </>
                      )}
                    </div>

                    {/* Image Thumbnails */}
                    {hotel.images.length > 1 && (
                      <div className="flex gap-2 mt-4 overflow-x-auto">
                        {hotel.images.map((image, index) => (
                          <button
                            key={image.id}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden ${
                              index === currentImageIndex ? 'border-primary-500' : 'border-gray-300'
                            }`}
                          >
                            <img
                              src={image.url}
                              alt={`Thumbnail ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Hotel Description */}
                <div className="bg-blue-50 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <FaInfoCircle className="text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-800">Description</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{hotel.description}</p>
                </div>

                {/* Hotel Metadata */}
                <div className="bg-green-50 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <FaCalendarAlt className="text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-800">Hotel Information</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Created At</label>
                      <p className="text-gray-800">{formatDate(hotel.created_at)}</p>
                    </div>
                    {hotel.updated_at && (
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Updated At</label>
                        <p className="text-gray-800">{formatDate(hotel.updated_at)}</p>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-600">City ID</label>
                      <p className="text-gray-800 font-mono">{hotel.city_id}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Country</label>
                      <p className="text-gray-800">{hotel.country.name} ({hotel.country.iso2})</p>
                    </div>
                    {hotel.address && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-600">Address</label>
                        <p className="text-gray-800">{hotel.address}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Statistics */}
                <div className="bg-yellow-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Statistics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-yellow-600">{hotel.rating}</p>
                      <p className="text-gray-600 text-sm">Star Rating</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-yellow-600">{hotel.images?.length || 0}</p>
                      <p className="text-gray-600 text-sm">Images</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-yellow-600">{hotel.country.iso2}</p>
                      <p className="text-gray-600 text-sm">Country Code</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-yellow-600">{hotel.description.length}</p>
                      <p className="text-gray-600 text-sm">Description Length</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="sticky bottom-0 bg-white border-t px-6 py-4">
            <div className="flex justify-end">
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Full Screen Image Modal */}
      {showImageModal && hotel?.images && hotel.images.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-60">
          <div className="relative max-w-full max-h-full">
            <img
              src={hotel.images[currentImageIndex].url}
              alt={hotel.images[currentImageIndex].alt || `Hotel image ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
            >
              ✕
            </button>
            {hotel.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-opacity"
                >
                  <FaChevronLeft />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-opacity"
                >
                  <FaChevronRight />
                </button>
              </>
            )}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded">
              {currentImageIndex + 1} / {hotel.images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShowHotelModal;
