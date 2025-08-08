import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import {
  FaHotel,
  FaSpinner,
  FaExclamationTriangle,
  FaStar,
  FaMapMarkerAlt,
  FaArrowLeft,
  FaImage,
  FaBed,
  FaUsers,
  FaCreditCard,
  FaInfoCircle,
} from "react-icons/fa";
import { Hotel, Room } from "../../types/hotel";

// API Response interface for hotel details
interface HotelDetailsResponse {
  status: string;
  message?: string;
  data: Hotel;
}

const HotelDetails = () => {
  const { hotelId } = useParams<{ hotelId: string }>();
  const navigate = useNavigate();

  // State management
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch hotel details
  const fetchHotelDetails = useCallback(async () => {
    if (!hotelId) {
      setError("Hotel ID is required");
      setLoading(false);
      return;
    }

    if (!token) {
      toast.error("Please login to view hotel details");
      navigate("/auth/login");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.get<HotelDetailsResponse>(
        `http://127.0.0.1:8000/api/hotel/${hotelId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data.status === "success") {
        setHotel(response.data.data[0]);
      } else {
        setError(response.data.message || "Failed to fetch hotel details");
      }
    } catch (err: any) {
      console.error("Error fetching hotel details:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to fetch hotel details";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [hotelId, token, navigate]);

  // Fetch hotel details on component mount
  useEffect(() => {
    fetchHotelDetails();
  }, [fetchHotelDetails]);

  // Handle room booking
  const handleBookRoom = useCallback((room: Room) => {
    setSelectedRoom(room);
    setBookingModalOpen(true);
    toast.info(`Booking ${room.room_type} room`);
    // You can implement actual booking logic here
  }, []);

  // Generate star rating display
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStar key="half" className="text-yellow-400 opacity-50" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="text-gray-300" />);
    }

    return stars;
  };

  // Format price
  const formatPrice = (price: string): string => {
    const numPrice = parseFloat(price);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(numPrice);
  };

  // Group rooms by type
  const groupRoomsByType = (rooms: Room[]) => {
    const grouped = rooms.reduce((acc, room) => {
      if (!acc[room.room_type]) {
        acc[room.room_type] = [];
      }
      acc[room.room_type].push(room);
      return acc;
    }, {} as Record<string, Room[]>);

    return grouped;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="text-4xl text-primary-500 animate-spin mb-4 mx-auto" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Loading Hotel Details
          </h2>
          <p className="text-gray-600">
            Please wait while we fetch the hotel information...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !hotel) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <FaExclamationTriangle className="text-4xl text-red-500 mb-4 mx-auto" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Unable to Load Hotel
          </h2>
          <p className="text-gray-600 mb-6">{error || "Hotel not found"}</p>
          <div className="space-x-4">
            <button
              onClick={() => navigate("/hotel")}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Back to Hotels
            </button>
            <button
              onClick={fetchHotelDetails}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const roomGroups = hotel.rooms ? groupRoomsByType(hotel.rooms) : {};

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate("/hotel")}
                className="mr-4 p-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <FaArrowLeft className="text-xl" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Hotel Details
                </h1>
                <p className="text-gray-600 mt-1">
                  Explore rooms and book your stay
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Hotel Information Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center mb-6">
            <FaHotel className="text-primary-500 text-2xl mr-3" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{hotel.name}</h2>
              <p className="text-gray-600">Hotel Information</p>
            </div>
          </div>

          {/* Hotel Basic Info */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Location and Rating */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <FaMapMarkerAlt className="mr-2 text-primary-500" />
                Location & Rating
              </h3>

              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Location:</span>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {hotel.city.name}, {hotel.country.name}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Rating:</span>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      {renderStars(hotel.rating)}
                    </div>
                    <span className="font-semibold text-gray-900">
                      {hotel.rating.toFixed(1)}
                    </span>
                  </div>
                </div>

                {hotel.address && (
                  <div className="flex justify-between items-start pt-2 border-t border-gray-200">
                    <span className="text-gray-600">Address:</span>
                    <div className="text-right max-w-xs">
                      <p className="text-sm text-gray-700">{hotel.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <FaInfoCircle className="mr-2 text-primary-500" />
                Description
              </h3>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 leading-relaxed">
                  {hotel.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Hotel Images Section */}
        {hotel.images && hotel.images.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <FaImage className="mr-2 text-primary-500" />
              Hotel Images
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {hotel.images.map((image, index) => (
                <div key={image.id} className="relative group">
                  <img
                    src={image.image_path || image.url}
                    alt={`Hotel ${hotel.name} - Image ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rooms Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Available Rooms
            </h2>
            <p className="text-gray-600">Choose your preferred room type</p>
          </div>

          {!hotel.rooms || hotel.rooms.length === 0 ? (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <FaExclamationTriangle className="text-4xl text-yellow-500 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Rooms Available
              </h3>
              <p className="text-gray-600">
                Unfortunately, there are no available rooms for this hotel at
                the moment.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(roomGroups).map(([roomType, rooms]) => (
                <div
                  key={roomType}
                  className="bg-white rounded-lg shadow-lg p-6"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <FaBed className="mr-2 text-primary-500" />
                    {roomType} Rooms ({rooms.length} available)
                  </h3>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rooms.map((room) => (
                      <div
                        key={room.id}
                        className="border flex flex-col justify-between border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                      >
                        <div>
                          {/* Room Header */}
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-gray-900">
                                {room.room_type}
                              </h4>
                              <div className="text-right">
                                <div className="text-lg font-bold text-green-600">
                                  {formatPrice(room.price_per_night)}
                                </div>
                                <div className="text-sm text-gray-500">
                                  per night
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* Room Details */}
                          <div className="space-y-3 mb-4">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600 flex items-center">
                                <FaUsers className="mr-2" />
                                Capacity
                              </span>
                              <span className="font-semibold text-gray-900">
                                {room.capacity} guest
                                {room.capacity !== 1 ? "s" : ""}
                              </span>
                            </div>

                            {room.description && (
                              <div className="pt-2 border-t border-gray-200">
                                <p className="text-gray-700 text-sm">
                                  {room.description}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Book Room Button */}
                        <button
                          onClick={() => handleBookRoom(room)}
                          className="w-full py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center"
                        >
                          <FaCreditCard className="mr-2" />
                          Book Room
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelDetails;
